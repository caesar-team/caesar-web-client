import { createReducer } from '@caesar/common/utils/reducer';
import {
  CREATE_CHILD_ITEM_BATCH_REQUEST,
  CREATE_CHILD_ITEM_BATCH_SUCCESS,
  CREATE_CHILD_ITEM_BATCH_FAILURE,
  CHANGE_CHILD_ITEM_PERMISSION_REQUEST,
  CHANGE_CHILD_ITEM_PERMISSION_SUCCESS,
  CHANGE_CHILD_ITEM_PERMISSION_FAILURE,
  ADD_CHILD_ITEMS_BATCH,
  REMOVE_CHILD_ITEMS_BATCH,
  RESET_STORE,
} from '@caesar/common/actions/entities/childItem';

const initialState = {
  isLoading: true,
  isError: false,
  byId: {},
};

export default createReducer(initialState, {
  [CREATE_CHILD_ITEM_BATCH_REQUEST](state) {
    return state;
  },
  [CREATE_CHILD_ITEM_BATCH_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        ...payload.childItemsById,
      },
    };
  },
  [CREATE_CHILD_ITEM_BATCH_FAILURE](state) {
    return state;
  },
  [CHANGE_CHILD_ITEM_PERMISSION_REQUEST](state) {
    return state;
  },
  [CHANGE_CHILD_ITEM_PERMISSION_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        ...payload.childItemsById,
      },
    };
  },
  [CHANGE_CHILD_ITEM_PERMISSION_FAILURE](state) {
    return state;
  },
  [ADD_CHILD_ITEMS_BATCH](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        ...payload.childItemsById,
      },
    };
  },
  [REMOVE_CHILD_ITEMS_BATCH](state, { payload }) {
    return {
      ...state,
      byId: Object.keys(state.byId).reduce(
        (accumulator, childItemId) =>
          payload.childItemIds.includes(childItemId)
            ? accumulator
            : { ...accumulator, [childItemId]: state.byId[childItemId] },
        {},
      ),
    };
  },
  [RESET_STORE]() {
    return initialState;
  },
});
