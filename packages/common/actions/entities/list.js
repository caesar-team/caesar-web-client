export const GET_LIST_REQUEST = '@list/GET_LIST_REQUEST';
export const GET_LIST_SUCCESS = '@list/GET_LIST_SUCCESS';
export const GET_LIST_FAILURE = '@list/GET_LIST_FAILURE';

export const CREATE_LIST_REQUEST = '@list/CREATE_LIST_REQUEST';
export const CREATE_LIST_SUCCESS = '@list/CREATE_LIST_SUCCESS';
export const CREATE_LIST_FAILURE = '@list/CREATE_LIST_FAILURE';

export const EDIT_LIST_REQUEST = '@list/EDIT_LIST_REQUEST';
export const EDIT_LIST_SUCCESS = '@list/EDIT_LIST_SUCCESS';
export const EDIT_LIST_FAILURE = '@list/EDIT_LIST_FAILURE';

export const REMOVE_LIST_REQUEST = '@list/REMOVE_LIST_REQUEST';
export const REMOVE_LIST_SUCCESS = '@list/REMOVE_LIST_SUCCESS';
export const REMOVE_LIST_FAILURE = '@list/REMOVE_LIST_FAILURE';

export const SORT_LIST_REQUEST = '@list/SORT_LIST_REQUEST';
export const SORT_LIST_SUCCESS = '@list/SORT_LIST_SUCCESS';
export const SORT_LIST_FAILURE = '@list/SORT_LIST_FAILURE';

export const ADD_LISTS_BATCH = '@list/ADD_LISTS_BATCH';

export const CLEAR_SERVER_ERRORS = '@list/CLEAR_SERVER_ERRORS';

export const RESET_LIST_STATE = '@list/RESET_LIST_STATE';

export const createListRequest = (list, meta) => ({
  type: CREATE_LIST_REQUEST,
  payload: {
    list,
  },
  meta,
});

export const createListSuccess = (listId, list) => ({
  type: CREATE_LIST_SUCCESS,
  payload: {
    listId,
    list,
  },
});

export const createListFailure = () => ({
  type: CREATE_LIST_FAILURE,
});

export const editListRequest = (list, meta) => ({
  type: EDIT_LIST_REQUEST,
  payload: {
    list,
  },
  meta,
});

export const editListSuccess = list => ({
  type: EDIT_LIST_SUCCESS,
  payload: {
    list,
  },
});

export const editListFailure = () => ({
  type: EDIT_LIST_FAILURE,
});

export const removeListRequest = (teamId, listId) => ({
  type: REMOVE_LIST_REQUEST,
  payload: {
    teamId,
    listId,
  },
});

export const removeListSuccess = listId => ({
  type: REMOVE_LIST_SUCCESS,
  payload: {
    listId,
  },
});

export const removeListFailure = () => ({
  type: REMOVE_LIST_FAILURE,
});

export const sortListRequest = (listId, sourceIndex, destinationIndex) => ({
  type: SORT_LIST_REQUEST,
  payload: {
    listId,
    sourceIndex,
    destinationIndex,
  },
});

export const sortListSuccess = resortedListsById => ({
  type: SORT_LIST_SUCCESS,
  payload: {
    resortedListsById,
  },
});

export const sortListFailure = () => ({
  type: SORT_LIST_FAILURE,
});

export const addListsBatch = listsById => ({
  type: ADD_LISTS_BATCH,
  payload: {
    listsById,
  },
});

export const clearServerErrors = () => ({
  type: CLEAR_SERVER_ERRORS,
});

export const resetListState = () => ({
  type: RESET_LIST_STATE,
});
