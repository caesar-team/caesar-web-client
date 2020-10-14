import { createReducer } from '@caesar/common/utils/reducer';
import {
  FINISH_IS_LOADING,
  RESET_WORK_IN_PROGRESS_ITEM_IDS,
  SET_WORK_IN_PROGRESS_ITEM,
  UPDATE_WORK_IN_PROGRESS_ITEM_RAWS,
  SET_WORK_IN_PROGRESS_ITEM_IDS,
  SET_WORK_IN_PROGRESS_LIST_ID,
  RESET_WORKFLOW_STATE,
  VAULTS_ARE_READY,
  OPEN_CURRENT_VAULT,
  INIT_DASHBOARD,
  FINISH_PROCESSING_KEYPAIRS,
} from '@caesar/common/actions/workflow';

const initialState = {
  isLoading: true,
  isError: false,
  isReady: false,
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
  [VAULTS_ARE_READY](state) {
    return {
      ...state,
      isReady: true,
    };
  },
  [OPEN_CURRENT_VAULT](state) {
    return state;
  },
  [INIT_DASHBOARD](state) {
    return state;
  },
  [FINISH_PROCESSING_KEYPAIRS](state) {
    return state;
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
          ...state.workInProgressItem?.data,
          raws: payload?.raws,
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
  [RESET_WORKFLOW_STATE]() {
    return initialState;
  },
});
