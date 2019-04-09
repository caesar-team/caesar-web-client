export const FETCH_NODES_REQUEST = '@nodes/FETCH_NODES_REQUEST';
export const FETCH_NODES_SUCCESS = '@nodes/FETCH_NODES_SUCCESS';
export const FETCH_NODES_FAILURE = '@nodes/FETCH_NODES_FAILURE';

export const ADD_NODE = '@nodes/DECRYPT_NODE';

export const fetchNodesRequest = () => ({
  type: FETCH_NODES_REQUEST,
});

export const fetchNodesSuccess = () => ({
  type: FETCH_NODES_SUCCESS,
});

export const fetchNodesFailure = () => ({
  type: FETCH_NODES_FAILURE,
});

export const addNode = node => ({
  type: ADD_NODE,
  payload: {
    node,
  },
});
