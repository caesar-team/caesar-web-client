import { createReducer } from '@caesar/common/utils/reducer';
import {
  START_IS_LOADING,
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
  INIT_CREATE_PAGE,
  INIT_TEAMS,
  INIT_USERS_SETTINGS,
  INIT_TEAMS_SETTINGS,
  INIT_TEAM_SETTINGS,
  INIT_IMPORT_SETTINGS,
  DECRYPTION,
  DECRYPTION_END,
} from '@caesar/common/actions/workflow';

const initialState = {
  isLoading: true,
  isError: false,
  isReady: false,
  isDecryptionProgress: false,
  workInProgressItem: null,
  workInProgressItemIds: [],
  workInProgressListId: null,
};

export default createReducer(initialState, {
  [START_IS_LOADING](state) {
    return {
      ...state,
      isLoading: true,
    };
  },
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
  [INIT_CREATE_PAGE](state) {
    return state;
  },
  [INIT_TEAMS](state) {
    return state;
  },
  [INIT_USERS_SETTINGS](state) {
    return state;
  },
  [INIT_TEAMS_SETTINGS](state) {
    return state;
  },
  [INIT_TEAM_SETTINGS](state) {
    return state;
  },
  [INIT_IMPORT_SETTINGS](state) {
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
  [DECRYPTION](state) {
    return {
      ...state,
      isDecryptionProgress: true,
    };
  },
  [DECRYPTION_END](state) {
    return {
      ...state,
      isDecryptionProgress: false,
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
