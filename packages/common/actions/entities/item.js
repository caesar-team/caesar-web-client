import { arrayToObject } from '../../utils/utils';

export const REMOVE_ITEM_REQUEST = '@item/REMOVE_ITEM_REQUEST';
export const REMOVE_ITEM_SUCCESS = '@item/REMOVE_ITEM_SUCCESS';
export const REMOVE_ITEM_FAILURE = '@item/REMOVE_ITEM_FAILURE';

export const REMOVE_ITEMS_BATCH_REQUEST = '@item/REMOVE_ITEMS_BATCH_REQUEST';
export const REMOVE_ITEMS_BATCH_SUCCESS = '@item/REMOVE_ITEMS_BATCH_SUCCESS';
export const REMOVE_ITEMS_BATCH_FAILURE = '@item/REMOVE_ITEMS_BATCH_FAILURE';

export const MOVE_ITEM_REQUEST = '@item/MOVE_ITEM_REQUEST';
export const MOVE_ITEM_SUCCESS = '@item/MOVE_ITEM_SUCCESS';
export const MOVE_ITEM_FAILURE = '@item/MOVE_ITEM_FAILURE';

export const MOVE_ITEMS_BATCH_REQUEST = '@item/MOVE_ITEMS_BATCH_REQUEST';
export const MOVE_ITEMS_BATCH_SUCCESS = '@item/MOVE_ITEMS_BATCH_SUCCESS';
export const MOVE_ITEMS_BATCH_FAILURE = '@item/MOVE_ITEMS_BATCH_FAILURE';

export const CREATE_ITEM_REQUEST = '@item/CREATE_ITEM_REQUEST';
export const CREATE_ITEM_SUCCESS = '@item/CREATE_ITEM_SUCCESS';
export const CREATE_ITEM_FAILURE = '@item/CREATE_ITEM_FAILURE';

export const CREATE_ITEMS_BATCH_REQUEST = '@item/CREATE_ITEMS_BATCH_REQUEST';
export const CREATE_ITEMS_BATCH_SUCCESS = '@item/CREATE_ITEMS_BATCH_SUCCESS';
export const CREATE_ITEMS_BATCH_FAILURE = '@item/CREATE_ITEMS_BATCH_FAILURE';

export const EDIT_ITEM_REQUEST = '@item/EDIT_ITEM_REQUEST';
export const EDIT_ITEM_SUCCESS = '@item/EDIT_ITEM_SUCCESS';
export const EDIT_ITEM_FAILURE = '@item/EDIT_ITEM_FAILURE';

export const UPDATE_ITEM_REQUEST = '@item/UPDATE_ITEM_REQUEST';
export const UPDATE_ITEM_SUCCESS = '@item/UPDATE_ITEM_SUCCESS';
export const UPDATE_ITEM_FAILURE = '@item/UPDATE_ITEM_FAILURE';

export const TOGGLE_ITEM_TO_FAVORITE_REQUEST =
  '@item/TOGGLE_ITEM_TO_FAVORITE_REQUEST';

export const CREATE_ANONYMOUS_LINK_REQUEST =
  '@item/CREATE_ANONYMOUS_LINK_REQUEST';
export const CREATE_ANONYMOUS_LINK_SUCCESS =
  '@item/CREATE_ANONYMOUS_LINK_SUCCESS';
export const CREATE_ANONYMOUS_LINK_FAILURE =
  '@item/CREATE_ANONYMOUS_LINK_FAILURE';

export const REMOVE_ANONYMOUS_LINK_REQUEST =
  '@item/REMOVE_ANONYMOUS_LINK_REQUEST';
export const REMOVE_ANONYMOUS_LINK_SUCCESS =
  '@item/REMOVE_ANONYMOUS_LINK_SUCCESS';
export const REMOVE_ANONYMOUS_LINK_FAILURE =
  '@item/REMOVE_ANONYMOUS_LINK_FAILURE';

export const SHARE_ITEM_BATCH_REQUEST = '@item/SHARE_ITEM_BATCH_REQUEST';
export const SHARE_ITEM_BATCH_SUCCESS = '@item/SHARE_ITEM_BATCH_SUCCESS';
export const SHARE_ITEM_BATCH_FAILURE = '@item/SHARE_ITEM_BATCH_FAILURE';

export const REMOVE_SHARE_REQUEST = '@item/REMOVE_SHARE_REQUEST';
export const REMOVE_SHARE_SUCCESS = '@item/REMOVE_SHARE_SUCCESS';
export const REMOVE_SHARE_FAILURE = '@item/REMOVE_SHARE_FAILURE';

export const UPDATE_ITEM_FIELD = '@item/UPDATE_ITEM_FIELD';
export const UPDATE_ITEM_BATCH_FIELD = '@item/UPDATE_ITEM_BATCH_FIELD';
export const ADD_ITEMS_BATCH = '@item/ADD_ITEMS_BATCH';
export const REMOVE_ITEMS_BATCH = '@item/REMOVE_ITEMS_BATCH';
export const REMOVE_ITEMS_BATCH_BY_TEAM_IDS =
  '@item/REMOVE_ITEMS_BATCH_BY_TEAM_IDS';

export const REMOVE_ITEMS_DATA = '@item/REMOVE_ITEMS_DATA';

export const RESET_ITEM_STATE = '@item/RESET_ITEM_STATE';

export const SET_IMPORT_PROGRESS_PERCENT = '@item/SET_IMPORT_PROGRESS_PERCENT';

export const removeItemRequest = (itemId, listId) => ({
  type: REMOVE_ITEM_REQUEST,
  payload: {
    itemId,
    listId,
  },
});

export const removeItemSuccess = (itemId, listId) => ({
  type: REMOVE_ITEM_SUCCESS,
  payload: {
    itemId,
    listId,
  },
});

export const removeItemFailure = () => ({
  type: MOVE_ITEM_FAILURE,
});

export const removeItemsBatchRequest = listId => ({
  type: REMOVE_ITEMS_BATCH_REQUEST,
  payload: {
    listId,
  },
});

export const removeItemsBatchSuccess = (itemIds, listId) => ({
  type: REMOVE_ITEMS_BATCH_SUCCESS,
  payload: {
    itemIds,
    listId,
  },
});

export const removeItemsBatchFailure = () => ({
  type: REMOVE_ITEMS_BATCH_FAILURE,
});

export const moveItemRequest = ({
  itemId,
  teamId,
  listId,
  notification,
  notificationText,
}) => ({
  type: MOVE_ITEM_REQUEST,
  payload: {
    itemId,
    teamId,
    listId,
  },
  meta: { notification, notificationText },
});

export const moveItemSuccess = payload => ({
  type: MOVE_ITEM_SUCCESS,
  payload,
});

export const moveItemFailure = () => ({
  type: MOVE_ITEM_FAILURE,
});

export const moveItemsBatchRequest = ({
  itemIds,
  oldTeamId,
  previousListId,
  teamId,
  listId,
  notification,
  notificationText,
}) => ({
  type: MOVE_ITEMS_BATCH_REQUEST,
  payload: {
    itemIds,
    oldTeamId,
    previousListId,
    teamId,
    listId,
  },
  meta: { notification, notificationText },
});

export const moveItemsBatchSuccess = ({
  itemIds,
  oldTeamId,
  previousListId,
  newTeamId,
  newListId,
  itemSecrets = {},
}) => ({
  type: MOVE_ITEMS_BATCH_SUCCESS,
  payload: {
    itemIds,
    oldTeamId,
    previousListId,
    newTeamId,
    newListId,
    itemSecrets,
  },
});

export const moveItemsBatchFailure = () => ({
  type: MOVE_ITEMS_BATCH_FAILURE,
});

export const createItemRequest = (item, setSubmitting) => {
  return {
    type: CREATE_ITEM_REQUEST,
    payload: {
      item,
    },
    meta: {
      setSubmitting,
    },
  };
};

export const createItemSuccess = item => ({
  type: CREATE_ITEM_SUCCESS,
  payload: {
    item,
  },
});

export const createItemFailure = () => ({
  type: CREATE_ITEM_FAILURE,
});

export const createItemsBatchRequest = (items, listId, setSubmitting) => ({
  type: CREATE_ITEMS_BATCH_REQUEST,
  payload: {
    items,
    listId,
  },
  meta: {
    setSubmitting,
  },
});

export const createItemsBatchSuccess = itemsById => ({
  type: CREATE_ITEMS_BATCH_SUCCESS,
  payload: {
    itemsById,
  },
});

export const createItemsBatchFailure = () => ({
  type: CREATE_ITEMS_BATCH_FAILURE,
});

export const setImportProgressPercent = percent => ({
  type: SET_IMPORT_PROGRESS_PERCENT,
  payload: {
    percent,
  },
});

export const editItemRequest = (
  { itemId, patch },
  setSubmitting,
  notification,
) => ({
  type: EDIT_ITEM_REQUEST,
  payload: {
    itemId,
    patch,
  },
  meta: {
    setSubmitting,
    notification,
  },
});

export const editItemSuccess = item => ({
  type: EDIT_ITEM_SUCCESS,
  payload: {
    item,
  },
});

export const editItemFailure = () => ({
  type: EDIT_ITEM_FAILURE,
});

export const updateItemRequest = () => ({
  type: UPDATE_ITEM_REQUEST,
});

export const updateItemSuccess = item => ({
  type: UPDATE_ITEM_SUCCESS,
  payload: {
    item,
  },
});

export const updateItemFailure = () => ({
  type: UPDATE_ITEM_FAILURE,
});

export const toggleItemToFavoriteRequest = item => ({
  type: TOGGLE_ITEM_TO_FAVORITE_REQUEST,
  payload: {
    item,
  },
});

export const createAnonymousLinkRequest = () => ({
  type: CREATE_ANONYMOUS_LINK_REQUEST,
});

export const createAnonymousLinkSuccess = (itemId, share) => ({
  type: CREATE_ANONYMOUS_LINK_SUCCESS,
  payload: {
    itemId,
    share,
  },
});

export const createAnonymousLinkFailure = () => ({
  type: CREATE_ANONYMOUS_LINK_FAILURE,
});

export const removeAnonymousLinkRequest = () => ({
  type: REMOVE_ANONYMOUS_LINK_REQUEST,
});

export const removeAnonymousLinkSuccess = itemId => ({
  type: REMOVE_ANONYMOUS_LINK_SUCCESS,
  payload: {
    itemId,
  },
});

export const removeAnonymousLinkFailure = () => ({
  type: REMOVE_ANONYMOUS_LINK_FAILURE,
});

export const updateItemField = (itemId, key, value) => ({
  type: UPDATE_ITEM_FIELD,
  payload: {
    itemId,
    key,
    value,
  },
});

export const updateItemBatchField = (itemIds, key, value) => ({
  type: UPDATE_ITEM_BATCH_FIELD,
  payload: {
    itemIds,
    key,
    value,
  },
});

export const addItemsBatch = items => {
  let itemsById = items;

  if (Array.isArray(items)) {
    itemsById = arrayToObject(items);
  }

  return {
    type: ADD_ITEMS_BATCH,
    payload: {
      itemsById,
    },
  };
};

export const removeItemsBatch = itemIds => ({
  type: REMOVE_ITEMS_BATCH,
  payload: {
    itemIds,
  },
});

export const removeItemsBatchByTeamIds = teamIds => ({
  type: REMOVE_ITEMS_BATCH_BY_TEAM_IDS,
  payload: {
    teamIds,
  },
});

export const removeItemsData = () => ({
  type: REMOVE_ITEMS_DATA,
});

export const shareItemBatchRequest = (
  { itemIds, users, teamIds },
  options = {},
) => ({
  type: SHARE_ITEM_BATCH_REQUEST,
  payload: {
    data: {
      itemIds,
      users,
      teamIds,
    },
    options,
  },
});

export const shareItemBatchSuccess = invited => ({
  type: SHARE_ITEM_BATCH_SUCCESS,
  payload: {
    invited,
  },
});

export const shareItemBatchFailure = () => ({
  type: SHARE_ITEM_BATCH_FAILURE,
});

export const removeShareRequest = (itemId, members) => ({
  type: REMOVE_SHARE_REQUEST,
  payload: {
    itemId,
    members,
  },
});

export const removeShareSuccess = (itemId, shareId) => ({
  type: REMOVE_SHARE_SUCCESS,
  payload: {
    itemId,
    shareId,
  },
});

export const removeShareFailure = () => ({
  type: REMOVE_SHARE_FAILURE,
});

export const resetItemState = () => ({
  type: RESET_ITEM_STATE,
});
