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
  REMOVE_LISTS_BATCH_BY_TEAM_IDS,
  RESET_LIST_STATE,
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
  [REMOVE_LISTS_BATCH_BY_TEAM_IDS](state, { payload }) {
    if (!state.byId || Object.keys(state.byId).length <= 0) return state;

    return {
      ...state,
      byId: Object.values(state.byId).reduce(
        (accumulator, list) =>
          payload.teamIds.includes(list.teamId)
            ? accumulator
            : { ...accumulator, [list.id]: state.byId[list.id] },
        {},
      ),
    };
  },
  [RESET_LIST_STATE]() {
    return initialState;
  },
});
