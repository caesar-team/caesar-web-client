import { createReducer } from 'common/utils/reducer';
import {
  FETCH_NODES_REQUEST,
  FETCH_NODES_SUCCESS,
  FETCH_NODES_FAILURE,
  ADD_NODE,
} from 'common/actions/nodes';

const initialState = {
  isLoading: false,
  isError: false,
  nodesById: {},
};

export default createReducer(initialState, {
  [FETCH_NODES_REQUEST](state) {
    return { ...state, isLoading: true };
  },
  [FETCH_NODES_SUCCESS](state) {
    return { ...state, isLoading: false, isError: false };
  },
  [FETCH_NODES_FAILURE](state) {
    return { ...state, isLoading: false, isError: true };
  },
  [ADD_NODE](state, { payload }) {
    return {
      ...state,
      nodesById: { ...state.nodesById, [payload.node.id]: payload.node },
    };
  },
});
