import { put, call, fork, takeLatest, select, all } from 'redux-saga/effects';
import {
  INIT_WORKFLOW,
  UPDATE_WORK_IN_PROGRESS_ITEM,
  DECRYPTION_END,
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
import { addTeamKeyPair } from '@caesar/common/actions/keyStore';
import { addChildItemsBatch } from '@caesar/common/actions/entities/childItem';
import { fetchMembersSaga } from '@caesar/common/sagas/entities/member';
import { convertNodesToEntities } from '@caesar/common/normalizers/normalizers';
import { objectToArray } from '@caesar/common/utils/utils';
import { sortItemsByFavorites } from '@caesar/common/utils/workflow';
import { getLists, getTeamLists, getTeams } from '@caesar/common/api';
import { ITEM_TYPE, TEAM_TYPE } from '@caesar/common/constants';
import {
  favoriteListSelector,
  trashListSelector,
  currentTeamTrashListSelector,
} from '@caesar/common/selectors/entities/list';
import {
  masterPasswordSelector,
  currentTeamIdSelector,
} from '@caesar/common/selectors/user';
import {
  itemSelector,
  itemsByIdSelector,
} from '@caesar/common/selectors/entities/item';
import {
  workInProgressListIdSelector,
  workInProgressItemSelector,
} from '@caesar/common/selectors/workflow';
import {
  personalKeyPairSelector,
  teamKeyPairSelector,
} from '@caesar/common/selectors/keyStore';
import { getFavoritesList } from '@caesar/common/normalizers/utils';
import { fetchTeamSuccess } from '@caesar/common/actions/entities/team';
import { getServerErrorMessage } from '@caesar/common/utils/error';

function* initPersonal(withDecryption) {console.log('Personal');
  try {
    const currentTeamId = yield select(currentTeamIdSelector);

    if (currentTeamId !== TEAM_TYPE.PERSONAL) {
      return;
    }

    const { data: lists } = yield call(getLists);

    const { listsById, itemsById, childItemsById } = convertNodesToEntities(
      lists,
    );

    if (withDecryption) {
      const keyPair = yield select(personalKeyPairSelector);
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

    const workInProgressListId = yield select(workInProgressListIdSelector);

    if (
      !workInProgressListId ||
      listsById[workInProgressListId]?.teamId !== currentTeamId
    ) {
      yield put(setWorkInProgressListId(favoritesList.id));
    }

    const workInProgressItem = yield select(workInProgressItemSelector);

    if (!workInProgressItem || workInProgressItem?.teamId !== currentTeamId) {
      yield put(setWorkInProgressItem(null));
    }

    yield put(resetWorkInProgressItemIds(null));

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

    if (currentTeamId === TEAM_TYPE.PERSONAL || currentTeamId !== team.id) {
      return;
    }

    const { data: lists } = yield call(getTeamLists, team.id);
    const { listsById, itemsById, childItemsById } = convertNodesToEntities(
      lists,
    );
    const trashList = yield select(currentTeamTrashListSelector);
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

    const workInProgressListId = yield select(workInProgressListIdSelector);

    if (
      !workInProgressListId ||
      listsById[workInProgressListId]?.teamId !== currentTeamId
    ) {
      yield put(setWorkInProgressListId(favoritesList.id));
    }

    const workInProgressItem = yield select(workInProgressItemSelector);

    if (!workInProgressItem || workInProgressItem?.teamId !== currentTeamId) {
      yield put(setWorkInProgressItem(null));
    }

    yield put(resetWorkInProgressItemIds(null));

    const teamSystemItem = yield select(teamKeyPairSelector, { teamId: team.id });

    if (currentTeamId === team.id && withDecryption) {
      const keyPair = yield select(personalKeyPairSelector);
      const masterPassword = yield select(masterPasswordSelector);
      const items = objectToArray(itemsById);

      if (items && items.length > 0) {
        if (teamSystemItem) {
          yield put(
            decryption({
              items,
              key: teamSystemItem.privateKey,
              masterPassword: teamSystemItem.pass,
            }),
          );
        } else {
          yield put(
            decryption({
              items,
              key: keyPair.privateKey,
              masterPassword,
            }),
          );
        }
      }
    } else {
      yield put(addItemsBatch(itemsById));
    }

    yield put(finishIsLoading());
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
  const currentTeamId = yield select(currentTeamIdSelector);

  yield put(setCurrentTeamId(currentTeamId || TEAM_TYPE.PERSONAL));
  yield fork(initPersonal, withDecryption);
  yield fork(initTeams, withDecryption);
  yield fork(fetchMembersSaga);
}

export function* updateWorkInProgressItemSaga({ payload: { itemId } }) {
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

    yield put(setWorkInProgressItem(item));
  }
}

export function* setCurrentTeamIdWatchSaga() {
  try {
    const currentTeamId = yield select(currentTeamIdSelector);

    if (!currentTeamId) return;

    if (currentTeamId === TEAM_TYPE.PERSONAL) {
      yield call(initPersonal, true);
    } else {
      yield call(initTeams, true);
    }
  } catch (error) {
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
  }
}

export function* decryptionEndWatchSaga() {
  try {
    const items = yield select(itemsByIdSelector);

    const systemItems =
      Object
        .values(items)
        .filter(({ type }) => type === ITEM_TYPE.SYSTEM);

    if (systemItems.length > 0) {
      yield all(systemItems => put(addTeamKeyPair(item)));
    }

  } catch(error) {
    console.log(error);
  }
}

export default function* workflowSagas() {
  yield takeLatest(INIT_WORKFLOW, initWorkflow);
  yield takeLatest(UPDATE_WORK_IN_PROGRESS_ITEM, updateWorkInProgressItemSaga);
  yield takeLatest(SET_CURRENT_TEAM_ID, setCurrentTeamIdWatchSaga);
  yield takeLatest(DECRYPTION_END, decryptionEndWatchSaga);
}
