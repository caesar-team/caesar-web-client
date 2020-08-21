import { createReducer } from '@caesar/common/utils/reducer';
import {
  FINISH_IS_LOADING,
  RESET_WORK_IN_PROGRESS_ITEM_IDS,
  SET_WORK_IN_PROGRESS_ITEM,
  UPDATE_WORK_IN_PROGRESS_ITEM_RAWS,
  SET_WORK_IN_PROGRESS_ITEM_IDS,
  SET_WORK_IN_PROGRESS_LIST_ID,
  RESET_WORKFLOW_STORE,
} from '@caesar/common/actions/workflow';

const initialState = {
  isLoading: true,
  isError: false,
  workInProgressItem: null,
  workInProgressItemIds: [],
  workInProgressListId: null,
};

export default createReducer(initialState, {
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
  [UPDATE_WORK_IN_PROGRESS_ITEM_RAWS](state, { payload }) {
    return {
      ...state,
      workInProgressItem: {
        ...state.workInProgressItem,
        data: {
          ...state.workInProgressItem.data,
          raws: payload.raws,
        },
      },
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
  [RESET_WORKFLOW_STORE]() {
    return initialState;
  },
});
