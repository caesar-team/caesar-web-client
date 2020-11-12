import { put, call, takeLatest, select } from 'redux-saga/effects';
import {
  CREATE_LIST_REQUEST,
  EDIT_LIST_REQUEST,
  REMOVE_LIST_REQUEST,
  SORT_LIST_REQUEST,
  createListSuccess,
  createListFailure,
  editListSuccess,
  editListFailure,
  removeListSuccess,
  removeListFailure,
  sortListSuccess,
  sortListFailure,
} from '@caesar/common/actions/entities/list';
import { updateGlobalNotification } from '@caesar/common/actions/application';
import {
  listSelector,
  nestedListsSelector,
  currentTeamTrashListSelector,
  trashListSelector,
} from '@caesar/common/selectors/entities/list';
import { moveItemsBatchSaga } from '@caesar/common/sagas/entities/item';
import {
  postCreateList,
  patchList,
  patchListSort,
  removeList,
  postCreateTeamList,
  patchTeamList,
  removeTeamList,
} from '@caesar/common/api';
import { ENTITY_TYPE, LIST_TYPE, TEAM_TYPE } from '@caesar/common/constants';
import { getServerErrors } from '@caesar/common/utils/error';
import { convertListsToEntities } from '@caesar/common/normalizers/normalizers';
import { itemsByListIdSelector } from '../../selectors/entities/item';
import { currentTeamIdSelector } from '../../selectors/currentUser';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const fixSort = lists => lists.map((list, index) => ({ ...list, sort: index }));

export function* sortListSaga({
  payload: { listId, sourceIndex, destinationIndex },
}) {
  try {
    const currentTeamId = yield select(currentTeamIdSelector);
    const lists = yield select(nestedListsSelector, { teamId: currentTeamId });

    yield put(
      sortListSuccess(
        fixSort(reorder(lists, sourceIndex, destinationIndex)).reduce(
          (acc, list) => ({ ...acc, [list.id]: list }),
          {},
        ),
      ),
    );

    yield call(patchListSort, listId, { sort: destinationIndex });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(sortListFailure());
  }
}

export function* createListSaga({
  payload: { list },
  meta: { setCreatingMode },
}) {
  try {
    const {
      data: { id: listId, _links },
    } =
      list.teamId && list.teamId !== TEAM_TYPE.PERSONAL
        ? yield call(postCreateTeamList, list.teamId, {
            label: list.label,
          })
        : yield call(postCreateList, {
            label: list.label,
          });

    yield call(setCreatingMode, false);

    const listData = {
      id: listId,
      type: LIST_TYPE.LIST,
      sort: 0,
      __type: ENTITY_TYPE.LIST,
      _links,
      ...list,
    };

    const listsById = convertListsToEntities([listData]);
    const normalizedList = Object.values(listsById).shift();

    yield put(createListSuccess(listId, normalizedList));

    const currentTeamId = yield select(currentTeamIdSelector);
    const lists = yield select(nestedListsSelector, { teamId: currentTeamId });
    const firstListInOrder = lists.find(
      ({ id, sort }) => sort === 0 && id !== listId,
    );

    if (firstListInOrder) {
      yield call(sortListSaga, {
        payload: {
          listId: firstListInOrder.id,
          sourceIndex: 0,
          destinationIndex: 1,
        },
      });
    }
  } catch (error) {
    yield put(createListFailure());
    yield put(updateGlobalNotification(getServerErrors(error), false, true));
  }
}

export function* editListSaga({ payload: { list }, meta: { setEditMode } }) {
  try {
    if (list.teamId === TEAM_TYPE.PERSONAL) {
      yield call(patchList, list.id, { label: list.label });
    } else {
      yield call(patchTeamList, list.teamId, list.id, { label: list.label });
    }

    yield call(setEditMode, false);
    yield put(editListSuccess(list));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(editListFailure());
    yield put(updateGlobalNotification(getServerErrors(error), false, true));
  }
}

export function* removeListSaga({ payload: { teamId, listId } }) {
  try {
    const list = yield select(listSelector, { listId });
    const listItemIds = yield select(itemsByListIdSelector, { listId }).map(
      item => item.id,
    );

    const trashList = teamId
      ? yield select(currentTeamTrashListSelector)
      : yield select(trashListSelector);

    yield call(moveItemsBatchSaga, {
      payload: {
        itemIds: listItemIds,
        oldTeamId: teamId || null,
        oldListId: list.id,
        teamId: teamId || null,
        listId: trashList?.id,
      },
    });

    if (teamId === TEAM_TYPE.PERSONAL) {
      yield call(removeList, listId);
    } else {
      yield call(removeTeamList, teamId, listId);
    }

    yield put(removeListSuccess(listId));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(removeListFailure());
  }
}

export default function* listSagas() {
  yield takeLatest(CREATE_LIST_REQUEST, createListSaga);
  yield takeLatest(EDIT_LIST_REQUEST, editListSaga);
  yield takeLatest(REMOVE_LIST_REQUEST, removeListSaga);
  yield takeLatest(SORT_LIST_REQUEST, sortListSaga);
}
