import { call, select, all, takeLatest, put } from '@redux-saga/core/effects';
import { getOrCreateMemberBatchSaga } from '@caesar/common/sagas/entities/member';
import { itemsBatchSelector } from '@caesar/common/selectors/entities/item';
import { userDataSelector } from '@caesar/common/selectors/user';
import {
  shareKeyPairSelector,
  teamKeyPairSelector,
} from '@caesar/common/selectors/keystore';
import {
  NOOP_NOTIFICATION,
  SHARING_IN_PROGRESS_NOTIFICATION,
  ENTITY_TYPE,
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
  createSystemItemKeyPair,
  encryptSecret,
  generateKeyPair,
  saveItemSaga,
} from '@caesar/common/sagas/entities/item';
import { convertSystemItemToKeyPair } from '../../utils/item';
import { getItem, getPublicKeyByEmailBatch, postItemShare } from '../../api';
import { uuid4 } from '../../utils/uuid4';
import { teamDefaultListSelector } from '../../selectors/entities/list';
import { convertKeyPairToItemEntity } from '../../normalizers/normalizers';

export function* prepareUsersForSharing(members) {
  const emailRolePairs = members.map(({ email, domainRoles }) => ({
    email,
    role:
      (domainRoles?.includes(DOMAIN_ROLES.ROLE_ADMIN)
        ? DOMAIN_ROLES.ROLE_ADMIN
        : DOMAIN_ROLES.ROLE_USER) || DOMAIN_ROLES.ROLE_USER,
  }));

  return yield call(getOrCreateMemberBatchSaga, {
    payload: { emailRolePairs },
  });
}

// @Deprecated
export function* findOrCreateKeyPair({ payload: { item } }) {
  let systemKeyPairItem = yield select(shareKeyPairSelector, {
    itemId: item.id,
  });
  const { userId: ownerId, publicKey } = yield select(userDataSelector);

  if (!systemKeyPairItem) {
    const systemItem = yield call(createSystemItemKeyPair, {
      payload: {
        entityId: item.id,
        entityOwnerId: ownerId,
        entityTeamId: item.teamId,
        entityType: ENTITY_TYPE.SHARE,
        publicKey,
      },
    });
    systemKeyPairItem = convertSystemItemToKeyPair(systemItem);
  }

  return systemKeyPairItem;
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
  const secret = yield call(encryptSecret, {
    item,
    publicKey,
  });

  return {
    userId,
    secret,
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
function* processMembersItemShare({ item, members }) {
  // Checking if the item already has shared
  let sharedItemKeyPairKey = yield select(shareKeyPairSelector, {
    itemId: item.id,
  });

  if (!sharedItemKeyPairKey) {
    const { publicKey: ownerPublicKey } = yield select(teamKeyPairSelector, {
      teamId: item.teamId,
    });
    const { id: ownerId } = yield select(userDataSelector);
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
    yield call(saveItemSaga, {
      item: ownerKey,
      publicKey: ownerPublicKey,
    });

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
  const usersToInvite = members.filter(
    member => !invitedUserIds.includes(member.id),
  );

  const { data: userPublicKeys } = yield call(getPublicKeyByEmailBatch, {
    emails: usersToInvite.map(m => m.email),
  });

  const membersSecretsCalls = userPublicKeys.map(
    ({ userId, publicKey: userPublicKey }) =>
      call(generateUserPostData, {
        keypair: sharedItemKeyPairKey,
        userId,
        publicKey: userPublicKey,
      }),
  );

  const memberSecrets = yield all(membersSecretsCalls);

  return call(postItemShare, {
    itemId: item.id,
    users: memberSecrets,
  });
}

// 1. Find or create the system keyPair item
// 2. ReCrypt the item and update it with the system keyPair item
// 3. Share the system keyPair item to the new members
export function* shareItemBatchSaga({
  payload: {
    data: { itemIds = [], members = [] },
  },
}) {
  try {
    yield put(updateGlobalNotification(SHARING_IN_PROGRESS_NOTIFICATION, true));
    // const currentTeamId = yield select(currentTeamIdSelector);
    const items = yield select(itemsBatchSelector, { itemIds });

    // Need To Go Deeper (c)
    yield all(
      yield all(
        items.map(item => call(processMembersItemShare, { item, members })),
      ),
    );

    const workInProgressItem = yield select(workInProgressItemSelector);
    if (workInProgressItem?.id) {
      const { data: workInProgressItemFromServer } = yield call(
        getItem,
        workInProgressItem?.id,
      );

      const updatedItem = {
        ...workInProgressItem,
        invited: workInProgressItemFromServer?.invited,
      };
      if (updatedItem.id) {
        yield put(
          addItemsBatch({
            [updatedItem.id]: updatedItem,
          }),
        );
      }
    }
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
