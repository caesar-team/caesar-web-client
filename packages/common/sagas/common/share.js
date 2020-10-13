import { call, select, all, takeLatest, put } from '@redux-saga/core/effects';
import { getOrCreateMemberBatchSaga } from '@caesar/common/sagas/entities/member';
import { itemsBatchSelector } from '@caesar/common/selectors/entities/item';
import { userDataSelector } from '@caesar/common/selectors/user';
import { shareKeyPairSelector } from '@caesar/common/selectors/keystore';
import {
  NOOP_NOTIFICATION,
  ROLE_USER,
  SHARING_IN_PROGRESS_NOTIFICATION,
  ENTITY_TYPE,
  ROLE_ADMIN,
} from '@caesar/common/constants';
import {
  shareItemBatchFailure,
  removeShareFailure,
  removeShareSuccess,
  SHARE_ITEM_BATCH_REQUEST,
  REMOVE_SHARE_REQUEST,
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
import { getPublicKeyByEmailBatch, postItemShare } from '../../api';
import { uuid4 } from '../../utils/uuid4';
import { teamDefaultListSelector } from '../../selectors/entities/list';

export function* prepareUsersForSharing(members) {
  const emailRolePairs = members.map(({ email, roles }) => ({
    email,
    role: roles.includes(ROLE_ADMIN) ? ROLE_ADMIN : ROLE_USER,
  }));

  return yield call(getOrCreateMemberBatchSaga, {
    payload: { emailRolePairs },
  });
}

// TODO: move to the system item sage
export function* findOrCreateSystemItemKeyPair({ payload: { item } }) {
  let systemKeyPairItem = yield select(shareKeyPairSelector, { id: item.id });
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
  const secret = yield call(encryptSecret, {
    item: keypair,
    publicKey,
  });

  return {
    userId,
    secret,
  };
}
function* processMembersItemShare({ item, members }) {
  // Create the new keypair for the shared item
  const generatedKeyPair = yield call(generateItemShareKey, item);
  const keypair = {
    id: uuid4(),
    ...generatedKeyPair,
  };
  const defaultList = yield select(teamDefaultListSelector, {
    teamId: item.teamId,
  });
  const { publicKey } = convertSystemItemToKeyPair(keypair);
  const currentUserKeyPairForSharedItem = {
    ...generatedKeyPair,
    relatedItemId: item.id,
    listId: defaultList.id,
  };

  yield call(saveItemSaga, {
    item: currentUserKeyPairForSharedItem,
    publicKey,
  });
  yield call(saveItemSaga, { item, publicKey });
  const { data: userPublicKeys } = yield call(getPublicKeyByEmailBatch, {
    emails: members.map(member => member.email),
  });

  const membersSecretsCalls = userPublicKeys.map(
    ({ userId, publicKey: userPublicKey }) =>
      call(generateUserPostData, {
        keypair,
        userId,
        publicKey: userPublicKey,
      }),
  );

  return yield all(membersSecretsCalls);
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

    const usersItemKeys = yield all(
      items.map(item => call(processMembersItemShare, { item, members })),
    );
    items.map(item =>
      call(postItemShare, {
        itemId: item.id,
        users: usersItemKeys,
      }),
    );

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
