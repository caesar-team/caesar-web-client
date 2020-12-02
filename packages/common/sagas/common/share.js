import { call, select, all, takeLatest, put } from '@redux-saga/core/effects';
import {
  fetchUsersSaga,
  getOrCreateUserBatchSaga,
} from '@caesar/common/sagas/entities/user';
import {
  itemsBatchSelector,
  itemSelector,
} from '@caesar/common/selectors/entities/item';
import { teamsMembersFullViewSelector } from '@caesar/common/selectors/entities/member';
import { userIdsSelector } from '@caesar/common/selectors/entities/user';
import { currentUserDataSelector } from '@caesar/common/selectors/currentUser';
import {
  shareKeyPairSelector,
  teamKeyPairSelector,
} from '@caesar/common/selectors/keystore';
import {
  NOOP_NOTIFICATION,
  SHARING_IN_PROGRESS_NOTIFICATION,
  DOMAIN_ROLES,
  TEAM_TYPE,
} from '@caesar/common/constants';
import {
  shareItemBatchFailure,
  removeShareFailure,
  removeShareSuccess,
  SHARE_ITEM_BATCH_REQUEST,
  REMOVE_SHARE_REQUEST,
  addItemsBatch,
} from '@caesar/common/actions/entities/item';
import { updateGlobalNotification } from '@caesar/common/actions/application';
import { updateWorkInProgressItem } from '@caesar/common/actions/workflow';
import { getServerErrorMessage } from '@caesar/common/utils/error';
import { workInProgressItemSelector } from '@caesar/common/selectors/workflow';
import {
  encryptItem,
  generateKeyPair,
  saveItemSaga,
  saveShareKeyPairSaga,
} from '@caesar/common/sagas/entities/item';
import { addShareKeyPairBatch } from '@caesar/common/actions/keystore';
import { convertSystemItemToKeyPair } from '../../utils/item';
import { getItem, getPublicKeyByEmailBatch, postItemShare } from '../../api';
import { uuid4 } from '../../utils/uuid4';
import { teamDefaultListSelector } from '../../selectors/entities/list';
import {
  convertItemsToEntities,
  convertKeyPairToItemEntity,
  convertKeyPairToEntity,
} from '../../normalizers/normalizers';

export function* prepareUsersForSharing(members) {
  const emailRolePairs = members.map(({ email, domainRoles }) => ({
    email,
    role:
      (domainRoles?.includes(DOMAIN_ROLES.ROLE_ADMIN)
        ? DOMAIN_ROLES.ROLE_ADMIN
        : DOMAIN_ROLES.ROLE_USER) || DOMAIN_ROLES.ROLE_USER,
  }));

  return yield call(getOrCreateUserBatchSaga, {
    payload: { emailRolePairs },
  });
}

export function* encryptItemBySharedKey({ item, publicKey }) {
  if (!publicKey) {
    throw new Error(
      `Can not find the publicKey for the shared item: ${item.id}`,
    );
  }

  // Check if the item already has shared
  if (!item.isShared) {
    const updatedItemFromServer = yield call(saveItemSaga, {
      item,
      publicKey,
    });

    return {
      ...updatedItemFromServer,
      ...item,
      ...{
        isShared: true,
      },
    };
  }

  return item;
}

function* generateItemShareKey(item) {
  return yield call(generateKeyPair, {
    name: `shared-${item.id}`,
  });
}

function* generateUserPostData({ keypair, userId, publicKey }) {
  const item = Object.values(convertKeyPairToItemEntity([keypair])).shift();
  const { data, raws } = yield call(encryptItem, {
    item,
    publicKey,
  });

  return {
    userId,
    secret: JSON.stringify({ data, raws }),
  };
}
function* getSharedItemKeyPairKey(item) {
  const generatedKeyPair = yield call(generateItemShareKey, item);
  const keypair = {
    id: uuid4(),
    ...generatedKeyPair,
  };

  return convertSystemItemToKeyPair(keypair);
}

// Todo: Some code for refacting
function* processMembersItemShare({ item, users }) {
  // Checking if the item already has shared
  let sharedItemKeyPairKey = yield select(shareKeyPairSelector, {
    itemId: item.id,
  });

  if (!sharedItemKeyPairKey) {
    const { publicKey: ownerPublicKey } = yield select(teamKeyPairSelector, {
      teamId: item.teamId,
    });
    const { id: ownerId } = yield select(currentUserDataSelector);
    const defaultList = yield select(teamDefaultListSelector, {
      teamId: item.teamId,
    });

    // eslint-disable-next-line require-atomic-updates
    sharedItemKeyPairKey = yield call(getSharedItemKeyPairKey, item);

    const itemKeyPair = Object.values(
      convertKeyPairToItemEntity([sharedItemKeyPairKey]),
    ).shift();

    const ownerKey = {
      ...itemKeyPair,
      ...{
        ownerId,
        listId: defaultList.id,
        relatedItemId: item.id,
        teamId: item.teamId !== TEAM_TYPE.PERSONAL ? item.teamId : null,
      },
    };

    // Need to save the new key to the owner's store
    const { data: serverShareKeyPairs } = yield call(saveShareKeyPairSaga, {
      item: ownerKey,
      publicKey: ownerPublicKey,
    });
    const serverOwnerSharedKeypair = serverShareKeyPairs?.shift();
    ownerKey.id = serverOwnerSharedKeypair?.keypairId;

    // Add to local store
    const shareKeysById = convertKeyPairToEntity([ownerKey], 'relatedItemId');
    yield put(addShareKeyPairBatch(shareKeysById));

    // Re-encrypt the item with new keys
    yield call(saveItemSaga, {
      item,
      publicKey: sharedItemKeyPairKey.publicKey,
    });
  }

  if (!sharedItemKeyPairKey) {
    throw new Error(`Can not find the keypair for the item ${item.id}`);
  }

  // Check duplicates members
  const invitedUserIds = item?.invited.map(invited => invited.userId);
  const usersToInvite = users.filter(user => !invitedUserIds.includes(user.id));

  const { data: userPublicKeys } = yield call(getPublicKeyByEmailBatch, {
    emails: usersToInvite.map(user => user.email),
  });

  const usersSecretsCalls = userPublicKeys.map(
    ({ userId, publicKey: userPublicKey }) =>
      call(generateUserPostData, {
        keypair: sharedItemKeyPairKey,
        userId,
        publicKey: userPublicKey,
      }),
  );

  const userSecrets = yield all(usersSecretsCalls);

  return call(postItemShare, {
    itemId: item.id,
    users: userSecrets,
  });
}

export function* updateSharedItemFromServer({ payload: { itemId } }) {
  const { data: itemFromServer } = yield call(getItem, itemId);
  const itemFromState = yield select(itemSelector, { itemId });
  const updatedItem = {
    ...itemFromState,
    invited: itemFromServer?.invited,
    isShared: true,
  };

  return updatedItem;
}

// 1. Find or create the system keyPair item
// 2. ReCrypt the item and update it with the system keyPair item
// 3. Share the system keyPair item to the new members
export function* shareItemBatchSaga({
  payload: {
    data: { itemIds = [], users = [], teamIds = [] },
  },
}) {
  try {
    yield put(updateGlobalNotification(SHARING_IN_PROGRESS_NOTIFICATION, true));

    // Update domain user list before create new domain user
    yield call(fetchUsersSaga);

    const domainUserIds = yield select(userIdsSelector);
    const domainUsers = users.filter(user => domainUserIds.includes(user.id));
    const notDomainUsers = users.filter(
      user => !domainUserIds.includes(user.id),
    );

    if (notDomainUsers.length) {
      yield all([
        // call(createUserSaga)
      ]);
    }

    const teamsMembers = yield select(teamsMembersFullViewSelector, {
      teamIds,
    });
    const allUsers = [...domainUsers, ...teamsMembers];
    const items = yield select(itemsBatchSelector, { itemIds });

    // Need To Go Deeper (c)
    yield all(
      yield all(
        items.map(item =>
          call(processMembersItemShare, {
            item,
            users: allUsers,
          }),
        ),
      ),
    );

    const updateSharedItemsFromServer = yield all(
      itemIds.map(itemId =>
        call(updateSharedItemFromServer, {
          payload: { itemId },
        }),
      ),
    );

    const { itemsById } = convertItemsToEntities(updateSharedItemsFromServer);
    yield put(addItemsBatch(itemsById));

    yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(shareItemBatchFailure());
  }
}

export function* removeShareSaga({ payload: { shareId } }) {
  try {
    // TODO: Implement remove sharing
    // eslint-disable-next-line no-console
    console.warn('Remove sharing will be implemented.');
    const workInProgressItem = yield select(workInProgressItemSelector);

    yield put(removeShareSuccess(workInProgressItem.id, shareId));
    yield put(updateWorkInProgressItem());

    yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(removeShareFailure());
  }
}

export function* shareItemSagas() {
  yield takeLatest(SHARE_ITEM_BATCH_REQUEST, shareItemBatchSaga);
  yield takeLatest(REMOVE_SHARE_REQUEST, removeShareSaga);
}
