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
import { removeItemsBatch } from '@caesar/common/actions/entities/item';
import { removeChildItemsBatch } from '@caesar/common/actions/entities/childItem';
import { updateGlobalNotification } from '@caesar/common/actions/application';
import {
  listSelector,
  sortedCustomizableListsSelector,
} from '@caesar/common/selectors/entities/list';
import { itemsBatchSelector } from '@caesar/common/selectors/entities/item';
import {
  removeList,
  postCreateList,
  patchListSort,
  patchList,
} from '@caesar/common/api';
import { ENTITY_TYPE, LIST_TYPE } from '@caesar/common/constants';
import { getServerErrorByNames, getServerErrorMessage } from '@caesar/common/utils/error';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const fixSort = lists => lists.map((list, index) => ({ ...list, sort: index }));

export function* createListSaga({ payload: { list }, meta: { notification, setCreatingMode } }) {
  try {
    const {
      data: { id: listId },
    } = yield call(postCreateList, {
      label: list.label,
    });

    yield call(setCreatingMode, false);
    yield put(
      createListSuccess(listId, {
        id: listId,
        type: LIST_TYPE.LIST,
        children: [],
        sort: 0,
        parentId: null,
        __type: ENTITY_TYPE.LIST,
        ...list,
      }),
    );
  } catch (error) {
    yield put(createListFailure());
    yield put(
      updateGlobalNotification(getServerErrorByNames(error), false, true),
    );
  }
}

export function* editListSaga({ payload: { list }, meta: { notification, setEditMode } }) {
  try {
    yield call(patchList, list.id, { label: list.label });

    yield call(setEditMode, false);
    yield put(editListSuccess(list));
  } catch (error) {
    console.log(error);
    yield put(editListFailure());
    yield put(
      updateGlobalNotification(getServerErrorByNames(error), false, true),
    );
  }
}

export function* removeListSaga({ payload: { listId } }) {
  try {
    yield call(removeList, listId);

    const list = yield select(listSelector, { listId });
    const listItemIds = list.children;
    const listItems = yield select(itemsBatchSelector, {
      itemIds: listItemIds,
    });
    const childItemIds = listItems.reduce(
      (accumulator, item) => [...accumulator, ...item.invited],
      [],
    );

    yield put(removeChildItemsBatch(childItemIds));
    yield put(removeItemsBatch(listItemIds));
    yield put(removeListSuccess(listId));
  } catch (error) {
    console.log(error);
    yield put(removeListFailure());
  }
}

export function* sortListSaga({
  payload: { listId, sourceIndex, destinationIndex },
}) {
  try {
    const sortedCustomizableLists = yield select(
      sortedCustomizableListsSelector,
    );

    yield put(
      sortListSuccess(
        fixSort(
          reorder(sortedCustomizableLists, sourceIndex, destinationIndex),
        ).reduce((acc, list) => ({ ...acc, [list.id]: list }), {}),
      ),
    );

    yield call(patchListSort, listId, { sort: destinationIndex });
  } catch (error) {
    console.log(error);
    yield put(sortListFailure());
  }
}

export default function* listSagas() {
  yield takeLatest(CREATE_LIST_REQUEST, createListSaga);
  yield takeLatest(EDIT_LIST_REQUEST, editListSaga);
  yield takeLatest(REMOVE_LIST_REQUEST, removeListSaga);
  yield takeLatest(SORT_LIST_REQUEST, sortListSaga);
}
