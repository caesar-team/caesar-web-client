import {
  call,
  select,
  all,
  takeLatest,
  put,
  fork,
  take,
} from '@redux-saga/core/effects';
import { getOrCreateMemberBatchSaga } from '@caesar/common/sagas/entities/member';
import {
  itemChildItemsSelector,
  itemsBatchSelector,
} from '@caesar/common/selectors/entities/item';
import {
  systemItemsBatchSelector,
} from '@caesar/common/selectors/entities/system';
import {
  masterPasswordSelector,
  userDataSelector,
  currentTeamIdSelector,
} from '@caesar/common/selectors/user';
import { actualKeyPairSelector } from '@caesar/common/selectors/keyStore';
import {
  decryptItem,
  getPrivateKeyObj,
} from '@caesar/common/utils/cipherUtils';
import {
  NOOP_NOTIFICATION,
  ROLE_USER,
  SHARING_IN_PROGRESS_NOTIFICATION,
  TEAM_TYPE,
} from '@caesar/common/constants';
import {
  shareItemBatchSuccess,
  shareItemBatchFailure,
  removeChildItemFromItem,
  removeShareFailure,
  removeShareSuccess,
  SHARE_ITEM_BATCH_REQUEST,
  REMOVE_SHARE_REQUEST,
} from '@caesar/common/actions/entities/item';
import { updateGlobalNotification } from '@caesar/common/actions/application';
import { teamsMembersSelector } from '@caesar/common/selectors/entities/team';
import { createChildItemBatchSaga } from '@caesar/common/sagas/entities/childItem';
import { CREATE_CHILD_ITEM_BATCH_FINISHED_EVENT } from '@caesar/common/actions/entities/childItem';
import { updateWorkInProgressItem } from '@caesar/common/actions/workflow';
import { getServerErrorMessage } from '@caesar/common/utils/error';
import { workInProgressItemSelector } from '@caesar/common/selectors/workflow';
import { deleteChildItem } from '@caesar/common/api';
import { inviteNewMemberBatchSaga } from './invite';

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
  const { id, data } = item;

  let itemData = data;

  if (!itemData) {
    itemData = yield call(decryptItem, item.secret, privateKeyObj);
  }

  return members.map(({ id: memberId, email, publicKey, teamId }) => ({
    item: { id, data: itemData },
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

export function* shareItemBatchSaga({
  payload: {
    data: { itemIds = [], members = [], teamIds = [] },
    options: { includeIniciator = true },
  },
}) {
  try {
    yield put(updateGlobalNotification(SHARING_IN_PROGRESS_NOTIFICATION, true));

    const user = yield select(userDataSelector);
    const currentTeamId = yield select(currentTeamIdSelector);
    let items = yield select(itemsBatchSelector, { itemIds });

    if (currentTeamId === TEAM_TYPE.PERSONAL) {
      items = yield select(systemItemsBatchSelector, { itemIds });
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

    const itemUserPairs = yield call(getItemUserPairs, {
      items,
      members: allMembers,
    });

    if (newMembers.length > 0) {
      yield fork(inviteNewMemberBatchSaga, {
        payload: { members: newMembers },
      });
    }

    if (itemUserPairs.length > 0) {
      yield fork(createChildItemBatchSaga, { payload: { itemUserPairs } });

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
    console.log(error);
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
    console.log(error);
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
