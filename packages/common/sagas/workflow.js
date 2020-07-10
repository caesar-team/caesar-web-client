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
import { TEAM_TYPE, ITEM_MODE } from '@caesar/common/constants';
import { favoriteListSelector, trashListSelector } from '@caesar/common/selectors/entities/list';
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

function* initPersonal(withDecryption) {console.log('Inir personal');
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

    //yield put(setCurrentTeamId(TEAM_TYPE.PERSONAL));

    const trashList = yield select(trashListSelector);
    const favoritesList = getFavoritesList(itemsById, trashList?.id);

    yield put(
      addListsBatch({
        ...listsById,
        [favoritesList.id]: favoritesList,
      }),
    );
    yield put(addChildItemsBatch(childItemsById));

    const favoriteList = yield select(favoriteListSelector);

    yield put(setWorkInProgressListId(favoriteList.id));

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
    console.log('5');
    const currentTeamId = yield select(currentTeamIdSelector);

    // const favoriteList = yield select(favoriteListSelector);
    // console.log(favoriteList.id);

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

      yield put(addListsBatch(listsById));
      yield put(addChildItemsBatch(childItemsById));

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

function* initTeams(withDecryption) {console.log('Init teams');
  try {
    const { data: teams } = yield call(getTeams);

    //yield put(setCurrentTeamId(TEAM_TYPE.PERSONAL));
    const favoriteList = yield select(favoriteListSelector);

   console.log(favoriteList.id);
    //yield put(setWorkInProgressListId(favoriteList.id));
    yield all(teams.map(team => call(initTeam, team, withDecryption)));
  } catch (error) {
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
  }
}

export function* initWorkflow({ payload: { withDecryption = true } }) {
  yield fork(fetchMembersSaga);
  yield fork(initPersonal, withDecryption);
  yield fork(initTeams, withDecryption);
}

export function* updateWorkInProgressItemSaga({
  payload: { itemId, mode = ITEM_MODE.REVIEW },
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
  try {
    yield put(setWorkInProgressItem(null));
    yield put(resetWorkInProgressItemIds(null));
    yield put(setWorkInProgressListId(null));

    const currentTeamId = yield select(currentTeamIdSelector);

    if (!currentTeamId || currentTeamId === TEAM_TYPE.PERSONAL) {
      return;
    }

    const { data } = yield call(getTeamLists, currentTeamId);

    const { listsById, itemsById, childItemsById } = convertNodesToEntities(
      data,
    );

    yield put(addListsBatch(listsById));
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
