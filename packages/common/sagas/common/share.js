import {
  call,
  select,
  all,
  takeLatest,
  put,
  take,
  fork,
} from '@redux-saga/core/effects';
import { getOrCreateMemberBatchSaga } from '@caesar/common/sagas/entities/member';
import { itemsBatchSelector } from '@caesar/common/selectors/entities/item';
import { systemItemsBatchSelector } from '@caesar/common/selectors/entities/system';
import { userDataSelector } from '@caesar/common/selectors/user';
import {
  shareKeyPairSelector,
  teamKeyPairSelector,
} from '@caesar/common/selectors/keystore';
import {
  decryptItem,
  unsealPrivateKeyObj,
} from '@caesar/common/utils/cipherUtils';
import {
  NOOP_NOTIFICATION,
  ROLE_USER,
  SHARING_IN_PROGRESS_NOTIFICATION,
  ENTITY_TYPE,
  TEAM_TYPE,
  ROLE_ADMIN,
} from '@caesar/common/constants';
import {
  shareItemBatchFailure,
  removeChildItemFromItem,
  removeShareFailure,
  removeShareSuccess,
  SHARE_ITEM_BATCH_REQUEST,
  REMOVE_SHARE_REQUEST,
  createItemsBatchSuccess,
  addItemsBatch,
} from '@caesar/common/actions/entities/item';
import { updateGlobalNotification } from '@caesar/common/actions/application';
import { teamsMembersSelector } from '@caesar/common/selectors/entities/team';
import { createChildItemBatchSaga } from '@caesar/common/sagas/entities/childItem';
import { updateWorkInProgressItem } from '@caesar/common/actions/workflow';
import { getServerErrorMessage } from '@caesar/common/utils/error';
import { workInProgressItemSelector } from '@caesar/common/selectors/workflow';
import { deleteChildItem } from '@caesar/common/api';
import {
  createSystemItemKeyPair,
  saveItemSaga,
} from '@caesar/common/sagas/entities/item';
import { CREATE_CHILD_ITEM_BATCH_FINISHED_EVENT } from '@caesar/common/actions/entities/childItem';
import { inviteNewMemberBatchSaga } from '@caesar/common/sagas/common/invite';
import { convertSystemItemToKeyPair } from '../../utils/item';

export function* prepareUsersForSharing(members) {
  const emailRolePairs = members.map(({ email, roles }) => ({
    email,
    role: roles.includes(ROLE_ADMIN) ? ROLE_ADMIN : ROLE_USER,
  }));

  return yield call(getOrCreateMemberBatchSaga, {
    payload: { emailRolePairs },
  });
}

function* getItemUserPairCombinations(systemItem, members = [], privateKeyObj) {
  const { id, data: { raws, ...data } = { raws: {} } } = systemItem;

  let itemData = data;
  const itemRaws = raws;

  if (!itemData) {
    itemData = yield call(decryptItem, systemItem.secret, privateKeyObj);
  }

  return members.map(({ id: memberId, email, publicKey, teamId }) => ({
    item: { id, data: itemData, raws: itemRaws },
    user: { id: memberId, email, publicKey, teamId },
  }));
}

export function* getItemUserPairs({ systemItems, members }) {
  const { privateKey, password } = yield select(teamKeyPairSelector, {
    teamId: TEAM_TYPE.PERSONAL,
  });
  const privateKeyObj = yield call(unsealPrivateKeyObj, privateKey, password);

  const itemUserPairs = yield all(
    systemItems.map(systemItem =>
      call(getItemUserPairCombinations, systemItem, members, privateKeyObj),
    ),
  );

  return itemUserPairs.flat();
}

// TODO: move to the system item sage
export function* findOrCreateSystemItemKeyPair({ payload: { item } }) {
  let systemKeyPairItem = yield select(shareKeyPairSelector, { id: item.id });

  if (!systemKeyPairItem) {
    const systemItem = yield call(createSystemItemKeyPair, {
      payload: { item, type: ENTITY_TYPE.SHARE },
    });
    systemKeyPairItem = convertSystemItemToKeyPair(systemItem);
  }

  return systemKeyPairItem;
}

export function* reCryptSharedItem(item) {
  const systemKeyPairItem = yield call(findOrCreateSystemItemKeyPair, {
    payload: {
      item,
    },
  });

  if (!systemKeyPairItem || !('id' in systemKeyPairItem)) {
    throw new Error(
      `Can not create the system keypair item for the shared item: ${item.id}`,
    );
  }

  const { publicKey } = systemKeyPairItem;

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
      ...item,
      ...updatedItemFromServer,
      ...{
        isShared: true,
      },
    };
  }

  return item;
}

// 1. Find or create the system keyPair item
// 2. ReCrypt the item and update it with the system keyPair item
// 3. Share the system keyPair item to the new members
export function* shareItemBatchSaga({
  payload: {
    data: { itemIds = [], members = [], teamIds = [] },
    options: { includeIniciator = true },
  },
}) {
  try {
    yield put(updateGlobalNotification(SHARING_IN_PROGRESS_NOTIFICATION, true));

    const user = yield select(userDataSelector);
    // const currentTeamId = yield select(currentTeamIdSelector);
    const items = yield select(itemsBatchSelector, { itemIds });

    const reCryptedSharedItems = yield all(items.map(reCryptSharedItem));
    yield put(createItemsBatchSuccess(reCryptedSharedItems));

    const systemKeyPairItems = yield select(systemItemsBatchSelector, {
      itemIds,
    });

    if (
      Object.values(systemKeyPairItems).filter(el => el != null).length !==
      items.length
    ) {
      throw new Error(
        `The system keypair items length doesn't match with the input items length`,
      );
    }

    const preparedMembers = yield call(prepareUsersForSharing, members);

    const newMembers = preparedMembers.filter(({ isNew }) => isNew);

    const directMembers = preparedMembers.map(member => ({
      ...member,
      teamId: null,
    }));

    const teamsMembers = yield select(teamsMembersSelector, { teamIds });

    const preparedTeamsMembers = includeIniciator
      ? teamsMembers
      : teamsMembers.filter(member => member.id !== user.id);

    const allMembers = [...directMembers, ...preparedTeamsMembers];

    if (newMembers.length > 0) {
      yield call(inviteNewMemberBatchSaga, {
        payload: { members: newMembers },
      });
    }
    // Share the system keypair items with users
    const itemUserPairs = yield call(getItemUserPairs, {
      systemItems: systemKeyPairItems,
      members: allMembers,
    });

    if (itemUserPairs.length > 0) {
      yield fork(createChildItemBatchSaga, { payload: { itemUserPairs } });

      yield take(CREATE_CHILD_ITEM_BATCH_FINISHED_EVENT);

      const sharedItemIds = systemKeyPairItems.map(
        systemItem => systemItem?.relatedItemId,
      );

      const sharedItems = yield select(itemsBatchSelector, {
        itemIds: sharedItemIds,
      });

      const updatedSharedItems = sharedItems.map(item => ({
        ...item,
        ...{
          invited: allMembers.map(member => member.id),
        },
      }));

      yield put(addItemsBatch(updatedSharedItems));
      // yield put(shareItemBatchSuccess(shares));

      yield put(updateWorkInProgressItem());
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
    const workInProgressItem = yield select(workInProgressItemSelector);

    yield call(deleteChildItem, shareId);

    yield put(removeChildItemFromItem(workInProgressItem.id, shareId));
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
