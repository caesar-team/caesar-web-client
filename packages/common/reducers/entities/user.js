import { createReducer } from '@caesar/common/utils/reducer';
import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
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
  [RESET_USER_STATE]() {
    return initialState;
  },
});
