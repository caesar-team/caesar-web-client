import { createReducer } from 'common/utils/reducer';
import {
  UPDATE_GLOBAL_NOTIFICATION,
  SET_APPLICATION_VERSION,
  INIT_CORES_COUNT,
  INCREASE_CORES_COUNT,
  DECREASE_CORES_COUNT,
} from 'common/actions/application';
import { DEFAULT_CORES_COUNT } from 'common/constants';

const initialState = {
  isLoading: false,
  isError: false,
  maxCoresCount: DEFAULT_CORES_COUNT,
  availableCoresCount: DEFAULT_CORES_COUNT,
  globalNotification: {
    isLoading: false,
    isError: false,
    text: '',
  },
  versions: {
    client: null,
    server: null,
  },
};

export default createReducer(initialState, {
  [UPDATE_GLOBAL_NOTIFICATION](state, { payload }) {
    return {
      ...state,
      globalNotification: payload,
    };
  },
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
      maxCoresCount: payload.count,
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
