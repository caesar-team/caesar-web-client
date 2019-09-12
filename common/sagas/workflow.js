import { put, call, fork, takeLatest, select } from 'redux-saga/effects';
import { decryption } from 'common/sagas/common/decryption';
import {
  INIT_PREPARATION_DATA_FLOW,
  UPDATE_WORK_IN_PROGRESS_ITEM,
  finishIsLoading,
  setWorkInProgressListId,
  setWorkInProgressItem,
  resetWorkInProgressItemIds,
} from 'common/actions/workflow';
import { addListsBatch } from 'common/actions/entities/list';
import { addItemsBatch } from 'common/actions/entities/item';
import { SET_CURRENT_TEAM_ID } from 'common/actions/user';
import { addChildItemsBatch } from 'common/actions/entities/childItem';
import { fetchMembersSaga } from 'common/sagas/entities/member';
import { fetchTeamsSaga } from 'common/sagas/entities/team';
import { convertNodesToEntities } from 'common/normalizers/normalizers';
import { objectToArray } from 'common/utils/utils';
import { sortItemsByFavorites, getMembersIds } from 'common/utils/workflow';
import { getLists, getTeamLists } from 'common/api';
import { ITEM_REVIEW_MODE } from 'common/constants';
import { favoriteListSelector } from 'common/selectors/entities/list';
import {
  keyPairSelector,
  masterPasswordSelector,
  currentTeamIdSelector,
} from 'common/selectors/user';
import { itemSelector } from 'common/selectors/entities/item';
import { workInProgressItemSelector } from 'common/selectors/workflow';
import { teamListSelector } from 'common/selectors/entities/team';
import { getFavoritesList } from 'common/normalizers/utils';

export function* initPersonalData({ payload: { withItemsDecryption } }) {
  try {
    const { data } = yield call(getLists);

    const { listsById, itemsById, childItemsById } = convertNodesToEntities(
      data,
    );

    const favoritesList = getFavoritesList(itemsById);

    yield fork(fetchMembersSaga, {
      payload: { memberIds: getMembersIds(itemsById, childItemsById) },
    });

    yield put(
      addListsBatch({
        ...listsById,
        [favoritesList.id]: favoritesList,
      }),
    );
    yield put(addChildItemsBatch(childItemsById));

    if (withItemsDecryption) {
      const keyPair = yield select(keyPairSelector);
      const masterPassword = yield select(masterPasswordSelector);

      yield fork(decryption, {
        items: sortItemsByFavorites(objectToArray(itemsById)),
        key: keyPair.privateKey,
        masterPassword,
      });

      yield put(finishIsLoading());
    } else {
      yield put(addItemsBatch(itemsById));
      yield put(finishIsLoading());
    }

    const favoriteList = yield select(favoriteListSelector);
    yield put(setWorkInProgressListId(favoriteList.id));
  } catch (error) {
    console.log(error);
  }
}

export function* initTeamData() {
  try {
    yield call(fetchTeamsSaga);

    const teamsList = yield select(teamListSelector);
    const currentTeamId = yield select(currentTeamIdSelector);

    if (teamsList.length && currentTeamId) {
      const { data } = yield call(getTeamLists, currentTeamId);

      const { listsById, itemsById, childItemsById } = convertNodesToEntities(
        data,
      );

      yield put(addListsBatch(listsById));
      yield put(addChildItemsBatch(childItemsById));

      const keyPair = yield select(keyPairSelector);
      const masterPassword = yield select(masterPasswordSelector);

      yield fork(decryption, {
        items: objectToArray(itemsById),
        key: keyPair.privateKey,
        masterPassword,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export function* initPreparationDataFlowSaga({
  payload: { withItemsDecryption },
}) {
  yield call(initPersonalData, { payload: { withItemsDecryption } });
  yield call(initTeamData);
}

export function* updateWorkInProgressItemSaga({
  payload: { itemId, mode = ITEM_REVIEW_MODE },
}) {
  let id = null;

  if (!itemId) {
    const workInProgressItem = yield select(workInProgressItemSelector);

    if (workInProgressItem) {
      id = workInProgressItem.id;
    }
  } else {
    id = itemId;
  }

  if (id) {
    const item = yield select(itemSelector, { itemId: id });

    yield put(setWorkInProgressItem(item, mode));
  }
}

export function* setCurrentTeamIdWatchSaga() {
  yield put(setWorkInProgressItem(null));
  yield put(resetWorkInProgressItemIds(null));
  yield put(setWorkInProgressListId(null));

  const currentTeamId = yield select(currentTeamIdSelector);

  if (!currentTeamId) {
    return;
  }

  const { data } = yield call(getTeamLists, currentTeamId);

  const { listsById, itemsById, childItemsById } = convertNodesToEntities(data);

  yield put(addListsBatch(listsById));
  yield put(addChildItemsBatch(childItemsById));

  const keyPair = yield select(keyPairSelector);
  const masterPassword = yield select(masterPasswordSelector);

  yield fork(decryption, {
    items: objectToArray(itemsById),
    key: keyPair.privateKey,
    masterPassword,
  });
}

export default function* workflowSagas() {
  yield takeLatest(INIT_PREPARATION_DATA_FLOW, initPreparationDataFlowSaga);
  yield takeLatest(UPDATE_WORK_IN_PROGRESS_ITEM, updateWorkInProgressItemSaga);
  yield takeLatest(SET_CURRENT_TEAM_ID, setCurrentTeamIdWatchSaga);
}
