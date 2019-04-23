import { createReducer } from 'common/utils/reducer';
import {
  FETCH_USER_SELF_REQUEST,
  FETCH_USER_SELF_SUCCESS,
  FETCH_USER_SELF_FAILURE,
  FETCH_KEY_PAIR_REQUEST,
  FETCH_KEY_PAIR_SUCCESS,
  FETCH_KEY_PAIR_FAILURE,
  SET_MASTER_PASSWORD,
} from 'common/actions/user';

const initialState = {
  isLoading: false,
  isError: false,
  keyPair: null,
  masterPassword: null,
  data: null,
};

export default createReducer(initialState, {
  [FETCH_USER_SELF_REQUEST](state) {
    return { ...state, isLoading: true };
  },
  [FETCH_USER_SELF_SUCCESS](state, { payload }) {
    return { ...state, isLoading: false, isError: false, data: payload.data };
  },
  [FETCH_USER_SELF_FAILURE](state) {
    return { ...state, isLoading: false, isError: true };
  },
  [FETCH_KEY_PAIR_REQUEST](state) {
    return { ...state, isLoading: false, isError: true };
  },
  [FETCH_KEY_PAIR_SUCCESS](state, { payload }) {
    return {
      ...state,
      isLoading: false,
      isError: true,
      keyPair: payload.keyPair,
    };
  },
  [FETCH_KEY_PAIR_FAILURE](state) {
    return { ...state, isLoading: false, isError: true };
  },
  [SET_MASTER_PASSWORD](state, { payload }) {
    return { ...state, masterPassword: payload.masterPassword };
  },
});
