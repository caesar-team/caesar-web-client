import { createReducer } from 'common/utils/reducer';
import { SET_APPLICATION_VERSION } from 'common/actions/application';

const initialState = {
  isLoading: false,
  isError: false,
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
});
