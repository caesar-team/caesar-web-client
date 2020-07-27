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

function* initPersonal(withDecryption) {console.log('initPersonal');
  try {
    const { data: lists } = yield call(getLists);
    console.log('initPersonal 1');
    const { listsById, itemsById, childItemsById } = convertNodesToEntities(
      lists,
    );
    console.log('initPersonal 2');
    if (withDecryption) {console.log('initPersonal 3');
      const keyPair = yield select(keyPairSelector);
      const masterPassword = yield select(masterPasswordSelector);
      const items = sortItemsByFavorites(objectToArray(itemsById));
      console.log('initPersonal 4');
      if (items && items.length > 0) {console.log('initPersonal 5');
        yield put(
          decryption({
            items,
            key: keyPair.privateKey,
            masterPassword,
          }),
        );
      }
    }
    console.log('initPersonal 6');
    const trashList = yield select(trashListSelector);
    console.log('initPersonal 7');
    const favoritesList = getFavoritesList(itemsById, trashList?.id);
    console.log('initPersonal 8');
    yield put(
      addListsBatch({
        ...listsById,
        [favoritesList.id]: favoritesList,
      }),
    );
    console.log('initPersonal 9');
    yield put(addChildItemsBatch(childItemsById));
    console.log('initPersonal 10');
    yield put(setWorkInProgressListId(favoritesList.id));
    console.log('initPersonal 11');
    yield put(finishIsLoading());
  } catch (error) {
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
  }
}

function* initTeam(team, withDecryption) {console.log('initTeam');
  try {
    console.log('initTeam 1');
    yield put(fetchTeamSuccess(team));
    console.log('initTeam 2');
    const currentTeamId = yield select(currentTeamIdSelector);
    console.log('initTeam 3');
    if (currentTeamId === TEAM_TYPE.PERSONAL) {
      return;
    }
    console.log('initTeam 4');
    if (!currentTeamId && team.type === TEAM_TYPE.DEFAULT) {console.log('initTeam 5');
      yield put(setCurrentTeamId(team.id));
      console.log('initTeam 6');
    } else {console.log('initTeam 7');
      const { data: lists } = yield call(getTeamLists, team.id);
      console.log('initTeam 8');
      const { listsById, itemsById, childItemsById } = convertNodesToEntities(
        lists,
      );
      console.log('initTeam 9');
      const trashList = yield select(teamsTrashListsSelector);
      console.log('initTeam 10');
      const favoritesList = getFavoritesList(
        itemsById,
        trashList?.id,
        currentTeamId,
      );
      console.log('initTeam 11');

      yield put(
        addListsBatch({
          ...listsById,
          [favoritesList.id]: favoritesList,
        }),
      );
      console.log('initTeam 12');
      yield put(addChildItemsBatch(childItemsById));
      console.log('initTeam 13');
      yield put(setWorkInProgressListId(favoritesList.id));
      console.log('initTeam 14');
      if (currentTeamId === team.id && withDecryption) {console.log('initTeam 15');
        const keyPair = yield select(keyPairSelector);
        const masterPassword = yield select(masterPasswordSelector);
        const items = objectToArray(itemsById);
        console.log('initTeam 16');
        if (items && items.length > 0) {console.log('initTeam 17');
          yield put(
            decryption({
              items,
              key: keyPair.privateKey,
              masterPassword,
            }),
          );
          console.log('initTeam 18');
        }
      } else {console.log('initTeam 19');
        yield put(addItemsBatch(itemsById));
        console.log('initTeam 20');
      }
    }
  } catch (error) {
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
  }
}

function* initTeams(withDecryption) {console.log('initTeams');
  try {console.log('initTeams 1');
    const { data: teams } = yield call(getTeams);
    console.log('initTeams 2');
    yield all(teams.map(team => call(initTeam, team, withDecryption)));
    console.log('initTeams 3');
  } catch (error) {
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
  }
}

export function* initWorkflow({ payload: { withDecryption = true } }) {console.log('initWorkflow');
  yield put(setCurrentTeamId(TEAM_TYPE.PERSONAL));console.log('initWorkflow 1');
  yield fork(fetchMembersSaga);console.log('initWorkflow 2');
  yield fork(initPersonal, withDecryption);console.log('initWorkflow 3');
  yield fork(initTeams, withDecryption);console.log('initWorkflow 4');
}

export function* updateWorkInProgressItemSaga({ payload: { itemId } }) {console.log('updateWorkInProgressItemSaga');
  let id = null;
  console.log('updateWorkInProgressItemSaga 1');
  if (!itemId) {console.log('updateWorkInProgressItemSaga 2');
    const workInProgressItem = yield select(workInProgressItemSelector);
    console.log('updateWorkInProgressItemSaga 3');
    if (workInProgressItem) {console.log('updateWorkInProgressItemSaga 4');
      id = workInProgressItem.id;
    }console.log('updateWorkInProgressItemSaga 5');
  } else {console.log('updateWorkInProgressItemSaga 6');
    id = itemId;
  }
  console.log('updateWorkInProgressItemSaga 7');
  if (id) {console.log('updateWorkInProgressItemSaga 8');
    const item = yield select(itemSelector, { itemId: id });
    console.log('updateWorkInProgressItemSaga 9');
    yield put(setWorkInProgressItem(item));
    console.log('updateWorkInProgressItemSaga 10');
  }
  console.log('updateWorkInProgressItemSaga 11');
}

export function* setCurrentTeamIdWatchSaga() {console.log('setCurrentTeamIdWatchSaga');
  try {console.log('setCurrentTeamIdWatchSaga 1');
    yield put(setWorkInProgressItem(null));
    console.log('setCurrentTeamIdWatchSaga 2');
    yield put(resetWorkInProgressItemIds(null));
    console.log('setCurrentTeamIdWatchSaga 3');
    yield put(setWorkInProgressListId(null));
    console.log('setCurrentTeamIdWatchSaga 4');
    const currentTeamId = yield select(currentTeamIdSelector);
    console.log('setCurrentTeamIdWatchSaga 5');
    if (!currentTeamId) return;
    console.log('setCurrentTeamIdWatchSaga 6');
    const { data } =
      currentTeamId === TEAM_TYPE.PERSONAL
        ? yield call(getLists)
        : yield call(getTeamLists, currentTeamId);
    console.log('setCurrentTeamIdWatchSaga 7');
    const { listsById, itemsById, childItemsById } = convertNodesToEntities(
      data,
    );
    console.log('setCurrentTeamIdWatchSaga 8');
    const trashList = yield select(teamsTrashListsSelector);
    console.log('setCurrentTeamIdWatchSaga 9');
    const favoritesList = getFavoritesList(
      itemsById,
      trashList?.id,
      currentTeamId,
    );
    console.log('setCurrentTeamIdWatchSaga 10');
    yield put(
      addListsBatch({
        ...listsById,
        [favoritesList.id]: favoritesList,
      }),
    );
    console.log('setCurrentTeamIdWatchSaga 11');
    yield put(addChildItemsBatch(childItemsById));
    console.log('setCurrentTeamIdWatchSaga 12');
    const keyPair = yield select(keyPairSelector);
    const masterPassword = yield select(masterPasswordSelector);
    const items = objectToArray(itemsById);
    console.log('setCurrentTeamIdWatchSaga 13');
    if (items && items.length > 0) {console.log('setCurrentTeamIdWatchSaga 14');
      yield put(
        decryption({
          items,
          key: keyPair.privateKey,
          masterPassword,
        }),
      );
      console.log('setCurrentTeamIdWatchSaga 15');
    }
    console.log('setCurrentTeamIdWatchSaga 16');
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
