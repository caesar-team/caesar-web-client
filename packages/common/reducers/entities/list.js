import { createReducer } from '@caesar/common/utils/reducer';
import {
  CREATE_LIST_REQUEST,
  CREATE_LIST_SUCCESS,
  CREATE_LIST_FAILURE,
  EDIT_LIST_REQUEST,
  EDIT_LIST_SUCCESS,
  EDIT_LIST_FAILURE,
  REMOVE_LIST_REQUEST,
  REMOVE_LIST_SUCCESS,
  REMOVE_LIST_FAILURE,
  SORT_LIST_REQUEST,
  SORT_LIST_SUCCESS,
  SORT_LIST_FAILURE,
  ADD_LISTS_BATCH,
  ADD_ITEM_TO_LIST,
  ADD_ITEMS_BATCH_TO_LIST,
  MOVE_ITEM_TO_LIST,
  MOVE_ITEMS_BATCH_TO_LIST,
  REMOVE_ITEM_FROM_LIST,
  REMOVE_ITEMS_BATCH_FROM_LIST,
} from '@caesar/common/actions/entities/list';

const initialState = {
  isLoading: true,
  isError: false,
  byId: {},
};

export default createReducer(initialState, {
  [CREATE_LIST_REQUEST](state) {
    return state;
  },
  [CREATE_LIST_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.listId]: payload.list,
      },
    };
  },
  [CREATE_LIST_FAILURE](state) {
    return state;
  },
  [EDIT_LIST_REQUEST](state) {
    return state;
  },
  [EDIT_LIST_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.list.id]: payload.list,
      },
    };
  },
  [EDIT_LIST_FAILURE](state) {
    return state;
  },
  [REMOVE_LIST_REQUEST](state) {
    return state;
  },
  [REMOVE_LIST_SUCCESS](state, { payload }) {
    const { [payload.listId]: item, ...rest } = state.byId;

    return {
      ...state,
      byId: rest,
    };
  },
  [REMOVE_LIST_FAILURE](state) {
    return state;
  },
  [SORT_LIST_REQUEST](state) {
    return state;
  },
  [SORT_LIST_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        ...payload.resortedListsById,
      },
    };
  },
  [SORT_LIST_FAILURE](state) {
    return state;
  },
  [ADD_LISTS_BATCH](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        ...payload.listsById,
      },
    };
  },
  [ADD_ITEM_TO_LIST](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.item.listId]: {
          ...state.byId[payload.item.listId],
          children: [
            ...state.byId[payload.item.listId].children,
            payload.item.id,
          ],
        },
      },
    };
  },
  [ADD_ITEMS_BATCH_TO_LIST](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.listId]: {
          ...state.byId[payload.listId],
          children: [
            ...state.byId[payload.listId].children,
            ...payload.itemIds,
          ],
        },
      },
    };
  },
  [MOVE_ITEM_TO_LIST](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.newListId]: {
          ...state.byId[payload.newListId],
          children: [...state.byId[payload.newListId].children, payload.itemId],
        },
        [payload.oldListId]: {
          ...state.byId[payload.oldListId],
          children: state.byId[payload.oldListId].children.filter(
            id => id !== payload.itemId,
          ),
        },
      },
    };
  },
  [MOVE_ITEMS_BATCH_TO_LIST](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.newListId]: {
          ...state.byId[payload.newListId],
          children: [
            ...state.byId[payload.newListId].children,
            ...payload.itemIds,
          ],
        },
        [payload.oldListId]: {
          ...state.byId[payload.oldListId],
          children: state.byId[payload.oldListId].children.filter(
            id => !payload.itemIds.includes(id),
          ),
        },
      },
    };
  },
  [REMOVE_ITEM_FROM_LIST](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.listId]: {
          ...state.byId[payload.listId],
          children: state.byId[payload.listId].children.filter(
            id => id !== payload.itemId,
          ),
        },
      },
    };
  },
  [REMOVE_ITEMS_BATCH_FROM_LIST](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.listId]: {
          ...state.byId[payload.listId],
          children: state.byId[payload.listId].children.filter(
            id => !payload.itemIds.includes(id),
          ),
        },
      },
    };
  },
});
