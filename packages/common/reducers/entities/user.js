import { createReducer } from '@caesar/common/utils/reducer';
import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
  CREATE_USER_BATCH_REQUEST,
  CREATE_USER_BATCH_SUCCESS,
  CREATE_USER_BATCH_FAILURE,
  RESET_USER_STATE,
} from '@caesar/common/actions/entities/user';

const initialState = {
  isLoading: false,
  isError: false,
  byId: {},
};

export default createReducer(initialState, {
  [FETCH_USERS_REQUEST](state) {
    return { ...state, isLoading: true };
  },
  [FETCH_USERS_SUCCESS](state, { payload }) {
    return {
      ...state,
      isLoading: false,
      isError: false,
      byId: payload.usersById,
    };
  },
  [FETCH_USERS_FAILURE](state) {
    return { ...state, isLoading: false, isError: true };
  },
  [CREATE_USER_REQUEST](state) {
    return state;
  },
  [CREATE_USER_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.user.id]: payload.user,
      },
    };
  },
  [CREATE_USER_FAILURE](state) {
    return state;
  },
  [CREATE_USER_BATCH_REQUEST](state) {
    return state;
  },
  [CREATE_USER_BATCH_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        ...payload.users,
      },
    };
  },
  [CREATE_USER_BATCH_FAILURE](state) {
    return state;
  },
  [RESET_USER_STATE]() {
    return initialState;
  },
});
