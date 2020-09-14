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
import {
  systemItemsBatchSelector,
  systemItemSelector,
} from '@caesar/common/selectors/entities/system';
import {
  masterPasswordSelector,
  userDataSelector,
  userPersonalDefaultListIdSelector,
} from '@caesar/common/selectors/user';
import {
  actualKeyPairSelector,
  personalKeyPairSelector,
  shareKeyPairSelector,
  shareKeyPairsSelector,
} from '@caesar/common/selectors/keyStore';
import {
  decryptItem,
  getPrivateKeyObj,
} from '@caesar/common/utils/cipherUtils';
import {
  NOOP_NOTIFICATION,
  ROLE_USER,
  SHARING_IN_PROGRESS_NOTIFICATION,
  ENTITY_TYPE,
} from '@caesar/common/constants';
import {
  shareItemBatchSuccess,
  shareItemBatchFailure,
  removeChildItemFromItem,
  removeShareFailure,
  removeShareSuccess,
  SHARE_ITEM_BATCH_REQUEST,
  REMOVE_SHARE_REQUEST,
  createItemsBatchSuccess,
} from '@caesar/common/actions/entities/item';
import { updateGlobalNotification } from '@caesar/common/actions/application';
import { teamsMembersSelector } from '@caesar/common/selectors/entities/team';
import { createChildItemBatchSaga } from '@caesar/common/sagas/entities/childItem';
import { updateWorkInProgressItem } from '@caesar/common/actions/workflow';
import { getServerErrorMessage } from '@caesar/common/utils/error';
import { workInProgressItemSelector } from '@caesar/common/selectors/workflow';
import { deleteChildItem } from '@caesar/common/api';
import { inviteNewMemberBatchSaga } from './invite';
import { generateSystemItem, saveItemSaga } from '../entities/item';
import { extractKeysFromSystemItem } from '../../utils/item';
import { addSystemItemsBatch } from '../../actions/entities/system';
import { CREATE_CHILD_ITEM_BATCH_FINISHED_EVENT } from '../../actions/entities/childItem';

export function* prepareUsersForSharing(members) {
  const emailRolePairs = members.map(({ email }) => ({
    email,
    role: ROLE_USER,
  }));

  return yield call(getOrCreateMemberBatchSaga, {
    payload: { emailRolePairs },
  });
}

function* getItemUserPairCombinations(item, members = [], privateKeyObj) {
  const { id, data: { raws, ...data } = { raws: {} } } = item;

  let itemData = data;
  const itemRaws = raws;

  if (!itemData) {
    itemData = yield call(decryptItem, item.secret, privateKeyObj);
  }

  return members.map(({ id: memberId, email, publicKey, teamId }) => ({
    item: { id, data: itemData, raws: itemRaws },
    user: { id: memberId, email, publicKey, teamId },
  }));
}

export function* getItemUserPairs({ items, members }) {
  const keyPair = yield select(actualKeyPairSelector);
  const masterPassword = yield select(masterPasswordSelector);

  const privateKeyObj = yield call(
    getPrivateKeyObj,
    keyPair.privateKey,
    masterPassword,
  );

  const itemUserPairs = yield all(
    items.map(item =>
      call(getItemUserPairCombinations, item, members, privateKeyObj),
    ),
  );

  return itemUserPairs.flat();
}

// TODO: move to the system item sage
export function* findOrCreateSystemItemKeyPair({ payload: { item } }) {
  let systemKeyPairItem = yield select(shareKeyPairSelector, { id: item.id });

  if (!systemKeyPairItem) {
    const userPersonalDefaultListId = yield select(
      userPersonalDefaultListIdSelector,
    );
    const { publicKey } = yield select(personalKeyPairSelector);

    systemKeyPairItem = yield call(
      generateSystemItem,
      ENTITY_TYPE.SHARE,
      userPersonalDefaultListId,
      item.id,
    );

    // Encrypt and save the system keypair item to the owner personal vault
    const systemItemFromServer = yield call(saveItemSaga, {
      item: { ...systemKeyPairItem, relatedItem: item.id },
      publicKey,
    });

    systemKeyPairItem = {
      ...systemKeyPairItem,
      ...systemItemFromServer,
    };

    yield put(
      addSystemItemsBatch({
        [systemKeyPairItem.id]: systemKeyPairItem,
      }),
    );

    return yield select(shareKeyPairSelector, { id: item.id });
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

  const updatedTeamFromServer = yield call(saveItemSaga, {
    item,
    publicKey,
  });

  return {
    ...item,
    ...updatedTeamFromServer,
  };
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
      items: systemKeyPairItems,
      members: allMembers,
    });

    if (itemUserPairs.length > 0) {
      yield fork(createChildItemBatchSaga, { payload: { itemUserPairs } });
      return;
      const {
        payload: { childItems },
      } = yield take(CREATE_CHILD_ITEM_BATCH_FINISHED_EVENT);

      const shares = childItems.reduce(
        (accumulator, item) => [
          ...accumulator,
          {
            itemId: item.originalItemId,
            childItemIds: item.items.map(({ id }) => id),
          },
        ],
        [],
      );

      yield put(shareItemBatchSuccess(shares));

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
