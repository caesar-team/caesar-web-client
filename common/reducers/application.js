import { createReducer } from 'common/utils/reducer';
import {
  SET_APPLICATION_VERSION,
  INIT_CORES_COUNT,
  INCREASE_CORES_COUNT,
  DECREASE_CORES_COUNT,
} from 'common/actions/application';

const initialState = {
  isLoading: false,
  isError: false,
  availableCoresCount: 4,
  versions: {
    client: null,
    server: null,
  },
};

export default createReducer(initialState, {
  [SET_APPLICATION_VERSION](state, { payload }) {
    return {
      ...state,
      versions: {
        ...state.versions,
        [payload.environment]: payload.version,
      },
    };
  },
  [INIT_CORES_COUNT](state, { payload }) {
    return {
      ...state,
      availableCoresCount: payload.count,
    };
  },
  [INCREASE_CORES_COUNT](state, { payload }) {
    return {
      ...state,
      availableCoresCount: state.availableCoresCount + payload.delta,
    };
  },
  [DECREASE_CORES_COUNT](state, { payload }) {
    return {
      ...state,
      availableCoresCount: state.availableCoresCount - payload.delta,
    };
  },
});
