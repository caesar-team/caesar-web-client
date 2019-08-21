import { createReducer } from 'common/utils/reducer';
import {
  FETCH_NODES_FAILURE,
  FETCH_NODES_REQUEST,
  FETCH_NODES_SUCCESS,
  FINISH_IS_LOADING,
  RESET_WORK_IN_PROGRESS_ITEM_IDS,
  SET_WORK_IN_PROGRESS_ITEM,
  UPDATE_WORK_IN_PROGRESS_ITEM,
  SET_WORK_IN_PROGRESS_ITEM_IDS,
  SET_WORK_IN_PROGRESS_LIST_ID,
} from 'common/actions/workflow';

const initialState = {
  isLoading: true,
  isError: false,
  workInProgressItem: null,
  workInProgressItemIds: [],
  workInProgressListId: null,
};

export default createReducer(initialState, {
  [FETCH_NODES_REQUEST](state) {
    return { ...state, isLoading: true };
  },
  [FETCH_NODES_SUCCESS](state) {
    return {
      ...state,
      isError: false,
    };
  },
  [FETCH_NODES_FAILURE](state) {
    return { ...state, isLoading: false, isError: true };
  },
  [FINISH_IS_LOADING](state) {
    return {
      ...state,
      isLoading: false,
    };
  },
  [SET_WORK_IN_PROGRESS_ITEM](state, { payload }) {
    return {
      ...state,
      workInProgressItem: payload.item
        ? {
            ...payload.item,
            mode: payload.mode,
          }
        : null,
    };
  },
  [SET_WORK_IN_PROGRESS_LIST_ID](state, { payload }) {
    return {
      ...state,
      workInProgressListId: payload.listId,
    };
  },
  [SET_WORK_IN_PROGRESS_ITEM_IDS](state, { payload }) {
    return {
      ...state,
      workInProgressItemIds: payload.itemIds,
    };
  },
  [RESET_WORK_IN_PROGRESS_ITEM_IDS](state) {
    return {
      ...state,
      workInProgressItemIds: [],
    };
  },
});
