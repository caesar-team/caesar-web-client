import { createReducer } from '@caesar/common/utils/reducer';
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
  UPDATE_ITEM_REQUEST,
  UPDATE_ITEM_SUCCESS,
  UPDATE_ITEM_FAILURE,
  TOGGLE_ITEM_TO_FAVORITE_REQUEST,
  CREATE_ANONYMOUS_LINK_FAILURE,
  CREATE_ANONYMOUS_LINK_REQUEST,
  CREATE_ANONYMOUS_LINK_SUCCESS,
  REMOVE_ANONYMOUS_LINK_FAILURE,
  REMOVE_ANONYMOUS_LINK_REQUEST,
  REMOVE_ANONYMOUS_LINK_SUCCESS,
  SHARE_ITEM_BATCH_REQUEST,
  SHARE_ITEM_BATCH_SUCCESS,
  SHARE_ITEM_BATCH_FAILURE,
  REMOVE_SHARE_FAILURE,
  REMOVE_SHARE_REQUEST,
  REMOVE_SHARE_SUCCESS,
  ADD_ITEMS_BATCH,
  REMOVE_ITEMS_BATCH,
  REMOVE_ITEMS_BATCH_BY_TEAM_IDS,
  REMOVE_ITEMS_DATA,
  UPDATE_ITEM_FIELD,
  UPDATE_ITEM_BATCH_FIELD,
  RESET_ITEM_STATE,
  SET_IMPORT_PROGRESS_PERCENT,
} from '@caesar/common/actions/entities/item';

const initialState = {
  isLoading: true,
  isError: false,
  importProgressPercent: 0,
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
  // TODO: Remove Dublicated with REMOVE_ITEMS_BATCH
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
    const { itemId, ...itemData } = payload;

    return {
      ...state,
      byId: {
        ...state.byId,
        [itemId]: {
          ...state.byId[itemId],
          ...itemData,
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
              previousListId: payload.previousListId,
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
    return {
      ...state,
      importProgressPercent: 0,
    };
  },
  [CREATE_ITEMS_BATCH_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        ...payload.itemsById,
      },
    };
  },
  [CREATE_ITEMS_BATCH_FAILURE](state) {
    return {
      ...state,
      importProgressPercent: 0,
    };
  },
  [SET_IMPORT_PROGRESS_PERCENT](state, { payload }) {
    return {
      ...state,
      importProgressPercent: state.importProgressPercent + payload.percent,
    };
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
  [UPDATE_ITEM_REQUEST](state) {
    return state;
  },
  [UPDATE_ITEM_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.item.id]: payload.item,
      },
    };
  },
  [UPDATE_ITEM_FAILURE](state) {
    return state;
  },
  [TOGGLE_ITEM_TO_FAVORITE_REQUEST](state) {
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
          shared: null,
        },
      },
    };
  },
  [REMOVE_ANONYMOUS_LINK_FAILURE](state) {
    return state;
  },
  [SHARE_ITEM_BATCH_REQUEST](state) {
    return state;
  },
  [SHARE_ITEM_BATCH_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        ...payload.invited.reduce(
          (accumulator, { itemId }) => ({
            ...accumulator,
            [itemId]: {
              ...state.byId[itemId],
              invited: [...(state.byId[itemId]?.invited || [])],
            },
          }),
          {},
        ),
      },
    };
  },
  [SHARE_ITEM_BATCH_FAILURE](state) {
    return state;
  },
  [REMOVE_SHARE_REQUEST](state) {
    return state;
  },
  [REMOVE_SHARE_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.itemId]: {
          ...state.byId[payload.itemId],
          invited: state.byId[payload.itemId].invited.filter(
            invite => invite.id !== payload.shareId,
          ),
        },
      },
    };
  },
  [REMOVE_SHARE_FAILURE](state) {
    return state;
  },
  [ADD_ITEMS_BATCH](state, { payload }) {
    if (Object.values(payload.itemsById) <= 0) return state;

    return {
      ...state,
      byId: {
        ...state.byId,
        ...payload.itemsById,
      },
    };
  },
  // TODO: Remove Dublicated with REMOVE_ITEMS_BATCH_SUCCESS
  [REMOVE_ITEMS_BATCH](state, { payload }) {
    if (!state.byId || Object.keys(state.byId).length <= 0) return state;

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
  [REMOVE_ITEMS_BATCH_BY_TEAM_IDS](state, { payload }) {
    if (!state.byId || Object.keys(state.byId).length <= 0) return state;

    return {
      ...state,
      byId: Object.values(state.byId).reduce(
        (accumulator, item) =>
          payload.teamIds.includes(item.teamId)
            ? accumulator
            : { ...accumulator, [item.id]: state.byId[item.id] },
        {},
      ),
    };
  },
  [REMOVE_ITEMS_DATA](state) {
    return {
      ...state,
      byId: Object.keys(state.byId).reduce(
        (accumulator, itemId) => ({
          ...accumulator,
          [itemId]: {
            ...state.byId[itemId],
            data: null,
          },
        }),
        {},
      ),
    };
  },
  [UPDATE_ITEM_FIELD](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.itemId]: {
          ...state.byId[payload.itemId],
          [payload.key]: payload.value,
        },
      },
    };
  },
  [UPDATE_ITEM_BATCH_FIELD](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        ...payload.itemIds.reduce(
          (accumulator, itemId) => ({
            ...accumulator,
            [itemId]: {
              ...state.byId[itemId],
              [payload.key]: payload.value,
            },
          }),
          {},
        ),
      },
    };
  },
  [RESET_ITEM_STATE]() {
    return initialState;
  },
});
