import { put, call, fork, takeLatest, select, all } from 'redux-saga/effects';
import {
  INIT_WORKFLOW,
  UPDATE_WORK_IN_PROGRESS_ITEM,
  finishIsLoading,
  setWorkInProgressListId,
  setWorkInProgressItem,
  resetWorkInProgressItemIds,
  decryption,
} from '@caesar/common/actions/workflow';
import { addListsBatch } from '@caesar/common/actions/entities/list';
import { addItemsBatch } from '@caesar/common/actions/entities/item';
import { updateGlobalNotification } from '@caesar/common/actions/application';
import {
  SET_CURRENT_TEAM_ID,
  setCurrentTeamId,
} from '@caesar/common/actions/user';
import { addChildItemsBatch } from '@caesar/common/actions/entities/childItem';
import { fetchMembersSaga } from '@caesar/common/sagas/entities/member';
import { convertNodesToEntities } from '@caesar/common/normalizers/normalizers';
import { objectToArray } from '@caesar/common/utils/utils';
import { sortItemsByFavorites } from '@caesar/common/utils/workflow';
import { getLists, getTeamLists, getTeams } from '@caesar/common/api';
import { TEAM_TYPE } from '@caesar/common/constants';
import {
  trashListSelector,
  teamsTrashListsSelector,
  favoriteListSelector,
} from '@caesar/common/selectors/entities/list';
import {
  keyPairSelector,
  masterPasswordSelector,
  currentTeamIdSelector,
} from '@caesar/common/selectors/user';
import { itemSelector } from '@caesar/common/selectors/entities/item';
import { workInProgressItemSelector } from '@caesar/common/selectors/workflow';
import { getFavoritesList } from '@caesar/common/normalizers/utils';
import { fetchTeamSuccess } from '@caesar/common/actions/entities/team';
import { getServerErrorMessage } from '@caesar/common/utils/error';

function* initPersonal(withDecryption) {
  try {
    const { data: lists } = yield call(getLists);
    const { listsById, itemsById, childItemsById } = convertNodesToEntities(
      lists,
    );

    if (withDecryption) {
      const keyPair = yield select(keyPairSelector);
      const masterPassword = yield select(masterPasswordSelector);
      const items = sortItemsByFavorites(objectToArray(itemsById));

      if (items && items.length > 0) {
        yield put(
          decryption({
            items,
            key: keyPair.privateKey,
            masterPassword,
          }),
        );
      }
    }

    const trashList = yield select(trashListSelector);
    let favoritesList = yield select(favoriteListSelector);

    if (!favoritesList?.id) {
      favoritesList = getFavoritesList(itemsById, trashList?.id);
    }

    yield put(
      addListsBatch({
        ...listsById,
        [favoritesList.id]: favoritesList,
      }),
    );
    yield put(addChildItemsBatch(childItemsById));

    yield put(setWorkInProgressListId(favoritesList.id));
    yield put(finishIsLoading());
  } catch (error) {
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
  }
}

function* initTeam(team, withDecryption) {
  try {
    yield put(fetchTeamSuccess(team));

    const currentTeamId = yield select(currentTeamIdSelector);

    if (currentTeamId === TEAM_TYPE.PERSONAL) {
      return;
    }

    if (!currentTeamId && team.type === TEAM_TYPE.DEFAULT) {
      yield put(setCurrentTeamId(team.id));
    } else {
      const { data: lists } = yield call(getTeamLists, team.id);
      const { listsById, itemsById, childItemsById } = convertNodesToEntities(
        lists,
      );
      const trashList = yield select(teamsTrashListsSelector);
      const favoritesList = getFavoritesList(
        itemsById,
        trashList?.id,
        currentTeamId,
      );

      yield put(
        addListsBatch({
          ...listsById,
          [favoritesList.id]: favoritesList,
        }),
      );

      yield put(addChildItemsBatch(childItemsById));

      yield put(setWorkInProgressListId(favoritesList.id));

      if (currentTeamId === team.id && withDecryption) {
        const keyPair = yield select(keyPairSelector);
        const masterPassword = yield select(masterPasswordSelector);
        const items = objectToArray(itemsById);

        if (items && items.length > 0) {
          yield put(
            decryption({
              items,
              key: keyPair.privateKey,
              masterPassword,
            }),
          );
        }
      } else {
        yield put(addItemsBatch(itemsById));
      }
    }
  } catch (error) {
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
  }
}

function* initTeams(withDecryption) {
  try {
    const { data: teams } = yield call(getTeams);

    yield all(teams.map(team => call(initTeam, team, withDecryption)));
  } catch (error) {
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
  }
}

export function* initWorkflow({ payload: { withDecryption = true } }) {
  yield put(setCurrentTeamId(TEAM_TYPE.PERSONAL));
  yield fork(fetchMembersSaga);
  yield fork(initPersonal, withDecryption);
  yield fork(initTeams, withDecryption);
}

export function* updateWorkInProgressItemSaga({ payload: { itemId } }) {// console.log('updateWorkInProgressItemSaga');
  let id = null;
  // console.log('updateWorkInProgressItemSaga 1');
  if (!itemId) {// console.log('updateWorkInProgressItemSaga 2');
    const workInProgressItem = yield select(workInProgressItemSelector);
    // console.log('updateWorkInProgressItemSaga 3');
    if (workInProgressItem) {// console.log('updateWorkInProgressItemSaga 4');
      id = workInProgressItem.id;
    }// console.log('updateWorkInProgressItemSaga 5');
  } else {// console.log('updateWorkInProgressItemSaga 6');
    id = itemId;
  }
  // console.log('updateWorkInProgressItemSaga 7');
  if (id) {// console.log('updateWorkInProgressItemSaga 8');
    const item = yield select(itemSelector, { itemId: id });
    // console.log('updateWorkInProgressItemSaga 9');
    yield put(setWorkInProgressItem(item));
    // console.log('updateWorkInProgressItemSaga 10');
  }
  // console.log('updateWorkInProgressItemSaga 11');
}

export function* setCurrentTeamIdWatchSaga() {
  try {
    yield put(setWorkInProgressItem(null));
    yield put(resetWorkInProgressItemIds(null));
    yield put(setWorkInProgressListId(null));

    const currentTeamId = yield select(currentTeamIdSelector);

    if (!currentTeamId) return;

    const { data } =
      currentTeamId === TEAM_TYPE.PERSONAL
        ? yield call(getLists)
        : yield call(getTeamLists, currentTeamId);

    const { listsById, itemsById, childItemsById } = convertNodesToEntities(
      data,
    );

    const trashList = yield select(teamsTrashListsSelector);

    let favoritesList = yield select(favoriteListSelector);

    if (!favoritesList?.id) {
     favoritesList = getFavoritesList(
        itemsById,
        trashList?.id,
        currentTeamId,
      );
    }

    yield put(
      addListsBatch({
        ...listsById,
        [favoritesList.id]: favoritesList,
      }),
    );
    yield put(addChildItemsBatch(childItemsById));

    const keyPair = yield select(keyPairSelector);
    const masterPassword = yield select(masterPasswordSelector);
    const items = objectToArray(itemsById);

    if (items && items.length > 0) {
      yield put(
        decryption({
          items,
          key: keyPair.privateKey,
          masterPassword,
        }),
      );
    }
  } catch (error) {
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
  }
}

export default function* workflowSagas() {
  yield takeLatest(INIT_WORKFLOW, initWorkflow);
  yield takeLatest(UPDATE_WORK_IN_PROGRESS_ITEM, updateWorkInProgressItemSaga);
  yield takeLatest(SET_CURRENT_TEAM_ID, setCurrentTeamIdWatchSaga);
}
