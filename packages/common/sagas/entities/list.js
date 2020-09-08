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
  personalListsByTypeSelector,
  currentTeamListsSelector,
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
import { ENTITY_TYPE, LIST_TYPE } from '@caesar/common/constants';
import { getServerErrorByNames } from '@caesar/common/utils/error';

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
    const personalListsByType = yield select(personalListsByTypeSelector);
    const currentTeamLists = yield select(currentTeamListsSelector);
    const lists = personalListsByType.list.length
      ? personalListsByType.list
      : currentTeamLists.list;

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
    console.log(error);
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
    } = list.teamId
      ? yield call(postCreateTeamList, list.teamId, {
          label: list.label,
        })
      : yield call(postCreateList, {
          label: list.label,
        });

    yield call(setCreatingMode, false);
    yield put(
      createListSuccess(listId, {
        id: listId,
        type: LIST_TYPE.LIST,
        children: [],
        sort: 0,
        __type: ENTITY_TYPE.LIST,
        _links,
        ...list,
      }),
    );

    const personalListsByType = yield select(personalListsByTypeSelector);
    const currentTeamLists = yield select(currentTeamListsSelector);
    const lists = personalListsByType.list.length
      ? personalListsByType.list
      : currentTeamLists.list;

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
    yield put(
      updateGlobalNotification(getServerErrorByNames(error), false, true),
    );
  }
}

export function* editListSaga({ payload: { list }, meta: { setEditMode } }) {
  try {
    if (list.teamId) {
      yield call(patchTeamList, list.teamId, list.id, { label: list.label });
    } else {
      yield call(patchList, list.id, { label: list.label });
    }

    yield call(setEditMode, false);
    yield put(editListSuccess(list));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    yield put(editListFailure());
    yield put(
      updateGlobalNotification(getServerErrorByNames(error), false, true),
    );
  }
}

export function* removeListSaga({ payload: { teamId, listId } }) {
  try {
    const list = yield select(listSelector, { listId });
    const listItemIds = list.children;

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

    if (teamId) {
      yield call(removeTeamList, teamId, listId);
    } else {
      yield call(removeList, listId);
    }

    yield put(removeListSuccess(listId));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    yield put(removeListFailure());
  }
}

export default function* listSagas() {
  yield takeLatest(CREATE_LIST_REQUEST, createListSaga);
  yield takeLatest(EDIT_LIST_REQUEST, editListSaga);
  yield takeLatest(REMOVE_LIST_REQUEST, removeListSaga);
  yield takeLatest(SORT_LIST_REQUEST, sortListSaga);
}
