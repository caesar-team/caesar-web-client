import { createReducer } from 'common/utils/reducer';
import {
  REMOVE_ITEM_REQUEST,
  REMOVE_ITEM_SUCCESS,
  REMOVE_ITEM_FAILURE,
  REMOVE_ITEMS_BATCH_REQUEST,
  REMOVE_ITEMS_BATCH_SUCCESS,
  REMOVE_ITEMS_BATCH_FAILURE,
  MOVE_ITEM_REQUEST,
  MOVE_ITEM_SUCCESS,
  MOVE_ITEM_FAILURE,
  MOVE_ITEMS_BATCH_REQUEST,
  MOVE_ITEMS_BATCH_SUCCESS,
  MOVE_ITEMS_BATCH_FAILURE,
  CREATE_ITEM_REQUEST,
  CREATE_ITEM_SUCCESS,
  CREATE_ITEM_FAILURE,
  CREATE_ITEMS_BATCH_REQUEST,
  CREATE_ITEMS_BATCH_SUCCESS,
  CREATE_ITEMS_BATCH_FAILURE,
  EDIT_ITEM_REQUEST,
  EDIT_ITEM_SUCCESS,
  EDIT_ITEM_FAILURE,
  ACCEPT_ITEM_UPDATE_REQUEST,
  ACCEPT_ITEM_UPDATE_SUCCESS,
  ACCEPT_ITEM_UPDATE_FAILURE,
  REJECT_ITEM_UPDATE_REQUEST,
  REJECT_ITEM_UPDATE_SUCCESS,
  REJECT_ITEM_UPDATE_FAILURE,
  TOGGLE_ITEM_TO_FAVORITE_REQUEST,
  TOGGLE_ITEM_TO_FAVORITE_SUCCESS,
  TOGGLE_ITEM_TO_FAVORITE_FAILURE,
  CREATE_ANONYMOUS_LINK_FAILURE,
  CREATE_ANONYMOUS_LINK_REQUEST,
  CREATE_ANONYMOUS_LINK_SUCCESS,
  REMOVE_ANONYMOUS_LINK_FAILURE,
  REMOVE_ANONYMOUS_LINK_REQUEST,
  REMOVE_ANONYMOUS_LINK_SUCCESS,
  ADD_ITEMS_BATCH,
  REMOVE_ITEMS_BATCH,
  ADD_CHILD_ITEM_TO_ITEM,
  ADD_CHILD_ITEMS_BATCH_TO_ITEM,
  REMOVE_CHILD_ITEM_FROM_ITEM,
  REMOVE_CHILD_ITEMS_BATCH_FROM_ITEM,
} from 'common/actions/item';

const initialState = {
  isLoading: true,
  isError: false,
  byId: {},
};

export default createReducer(initialState, {
  [REMOVE_ITEM_REQUEST](state) {
    return state;
  },
  [REMOVE_ITEM_SUCCESS](state, { payload }) {
    const { [payload.itemId]: item, ...rest } = state.byId;

    return {
      ...state,
      byId: rest,
    };
  },
  [REMOVE_ITEM_FAILURE](state) {
    return state;
  },
  [REMOVE_ITEMS_BATCH_REQUEST](state) {
    return state;
  },
  [REMOVE_ITEMS_BATCH_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: Object.keys(state.byId).reduce(
        (accumulator, itemId) =>
          payload.itemIds.includes(itemId)
            ? accumulator
            : { ...accumulator, [itemId]: state.byId[itemId] },
        {},
      ),
    };
  },
  [REMOVE_ITEMS_BATCH_FAILURE](state) {
    return state;
  },
  [MOVE_ITEM_REQUEST](state) {
    return state;
  },
  [MOVE_ITEM_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.itemId]: {
          ...state.byId[payload.itemId],
          listId: payload.newListId,
          previousListId: payload.oldListId,
        },
      },
    };
  },
  [MOVE_ITEM_FAILURE](state) {
    return state;
  },
  [MOVE_ITEMS_BATCH_REQUEST](state) {
    return state;
  },
  [MOVE_ITEMS_BATCH_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        ...payload.itemIds.reduce(
          (accumulator, itemId) => ({
            ...accumulator,
            [itemId]: {
              ...state.byId[itemId],
              listId: payload.newListId,
              previousListId: payload.oldListId,
            },
          }),
          {},
        ),
      },
    };
  },
  [MOVE_ITEMS_BATCH_FAILURE](state) {
    return state;
  },
  [CREATE_ITEM_REQUEST](state) {
    return state;
  },
  [CREATE_ITEM_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.item.id]: payload.item,
      },
    };
  },
  [CREATE_ITEM_FAILURE](state) {
    return state;
  },
  [CREATE_ITEMS_BATCH_REQUEST](state) {
    return state;
  },
  [CREATE_ITEMS_BATCH_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        ...payload.items.reduce(
          (accumulator, item) => ({ ...accumulator, [item.id]: item }),
          {},
        ),
      },
    };
  },
  [CREATE_ITEMS_BATCH_FAILURE](state) {
    return state;
  },
  [EDIT_ITEM_REQUEST](state) {
    return state;
  },
  [EDIT_ITEM_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.item.id]: payload.item,
      },
    };
  },
  [EDIT_ITEM_FAILURE](state) {
    return state;
  },
  [ACCEPT_ITEM_UPDATE_REQUEST](state) {
    return state;
  },
  [ACCEPT_ITEM_UPDATE_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.item.id]: payload.item,
      },
    };
  },
  [ACCEPT_ITEM_UPDATE_FAILURE](state) {
    return state;
  },
  [REJECT_ITEM_UPDATE_REQUEST](state) {
    return state;
  },
  [REJECT_ITEM_UPDATE_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.itemId]: {
          ...state.byId[payload.itemId],
          update: null,
        },
      },
    };
  },
  [REJECT_ITEM_UPDATE_FAILURE](state) {
    return state;
  },
  [TOGGLE_ITEM_TO_FAVORITE_REQUEST](state) {
    return state;
  },
  [TOGGLE_ITEM_TO_FAVORITE_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.itemId]: {
          ...state.byId[payload.itemId],
          favorite: payload.isFavorite,
        },
      },
    };
  },
  [TOGGLE_ITEM_TO_FAVORITE_FAILURE](state) {
    return state;
  },
  [CREATE_ANONYMOUS_LINK_REQUEST](state) {
    return state;
  },
  [CREATE_ANONYMOUS_LINK_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.itemId]: {
          ...state.byId[payload.itemId],
          shared: payload.share,
        },
      },
    };
  },
  [CREATE_ANONYMOUS_LINK_FAILURE](state) {
    return state;
  },
  [REMOVE_ANONYMOUS_LINK_REQUEST](state) {
    return state;
  },
  [REMOVE_ANONYMOUS_LINK_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.itemId]: {
          ...state.byId[payload.itemId],
          shared: [],
        },
      },
    };
  },
  [REMOVE_ANONYMOUS_LINK_FAILURE](state) {
    return state;
  },
  [ADD_ITEMS_BATCH](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        ...payload.itemsById,
      },
    };
  },
  [REMOVE_ITEMS_BATCH](state, { payload }) {
    return {
      ...state,
      byId: Object.keys(state.byId).reduce(
        (accumulator, itemId) =>
          payload.itemIds.includes(itemId)
            ? accumulator
            : { ...accumulator, [itemId]: state.byId[itemId] },
        {},
      ),
    };
  },
  [ADD_CHILD_ITEM_TO_ITEM](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.itemId]: {
          ...state.byId[payload.itemId],
          invited: [
            ...state.byId[payload.itemId].invited,
            { id: payload.childItemId },
          ],
        },
      },
    };
  },
  [ADD_CHILD_ITEMS_BATCH_TO_ITEM](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        ...payload.itemIds.reduce(
          (accumulator, itemId) => ({
            ...accumulator,
            [itemId]: {
              ...state.byId[itemId],
              invited: [
                ...state.byId[itemId].invited,
                ...payload.childItemIds.map(childItemId => ({
                  id: childItemId,
                })),
              ],
            },
          }),
          {},
        ),
      },
    };
  },
  [REMOVE_CHILD_ITEM_FROM_ITEM](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.itemId]: {
          ...state.byId[payload.itemId],
          invited: state.byId[payload.itemId].invited.filter(
            ({ id }) => payload.childItemId !== id,
          ),
        },
      },
    };
  },
  [REMOVE_CHILD_ITEMS_BATCH_FROM_ITEM](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        ...payload.itemIds.reduce(
          (accumulator, itemId) => ({
            ...accumulator,
            [itemId]: {
              ...state.byId[itemId],
              invited: state.byId[payload.itemId].invited.filter(
                ({ id }) => !payload.childItemIds.includes(id),
              ),
            },
          }),
          {},
        ),
      },
    };
  },
});
