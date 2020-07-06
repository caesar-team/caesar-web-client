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
export const ADD_ITEM_TO_LIST = '@list/ADD_ITEM_TO_LIST';
export const ADD_ITEMS_BATCH_TO_LIST = '@list/ADD_ITEMS_BATCH_TO_LIST';
export const MOVE_ITEM_TO_LIST = '@list/MOVE_ITEM_TO_LIST';
export const MOVE_ITEMS_BATCH_TO_LIST = '@list/MOVE_ITEMS_BATCH_TO_LIST';
export const REMOVE_ITEM_FROM_LIST = '@list/REMOVE_ITEM_FROM_LIST';
export const REMOVE_ITEMS_BATCH_FROM_LIST =
  '@list/REMOVE_ITEMS_BATCH_FROM_LIST';
export const TOGGLE_ITEM_TO_FAVORITE_LIST =
  '@list/TOGGLE_ITEM_TO_FAVORITE_LIST';

export const CLEAR_SERVER_ERRORS = '@list/CLEAR_SERVER_ERRORS';

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
  meta: {
    notification,
  },
});

export const editListFailure = () => ({
  type: EDIT_LIST_FAILURE,
});

export const removeListRequest = listId => ({
  type: REMOVE_LIST_REQUEST,
  payload: {
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

export const addItemToList = item => ({
  type: ADD_ITEM_TO_LIST,
  payload: {
    item,
  },
});

export const addItemsBatchToList = (itemIds, listId) => ({
  type: ADD_ITEMS_BATCH_TO_LIST,
  payload: {
    itemIds,
    listId,
  },
});

export const moveItemToList = (itemId, oldListId, newListId) => ({
  type: MOVE_ITEM_TO_LIST,
  payload: {
    itemId,
    oldListId,
    newListId,
  },
});

export const moveItemsBatchToList = (itemIds, oldListId, newListId) => ({
  type: MOVE_ITEMS_BATCH_TO_LIST,
  payload: {
    itemIds,
    oldListId,
    newListId,
  },
});

export const removeItemFromList = (itemId, listId) => ({
  type: REMOVE_ITEM_FROM_LIST,
  payload: {
    itemId,
    listId,
  },
});

export const removeItemsBatchFromList = (itemIds, listId) => ({
  type: REMOVE_ITEMS_BATCH_FROM_LIST,
  payload: {
    itemIds,
    listId,
  },
});

export const toggleItemToFavoriteList = (
  itemId,
  favoritesListId,
  isFavorite,
) => ({
  type: TOGGLE_ITEM_TO_FAVORITE_LIST,
  payload: {
    itemId,
    favoritesListId,
    isFavorite,
  },
});

export const clearServerErrors = () => ({
  type: CLEAR_SERVER_ERRORS,
});
