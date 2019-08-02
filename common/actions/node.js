export const FETCH_NODES_REQUEST = '@nodes/FETCH_NODES_REQUEST';
export const FETCH_NODES_SUCCESS = '@nodes/FETCH_NODES_SUCCESS';
export const FETCH_NODES_FAILURE = '@nodes/FETCH_NODES_FAILURE';

export const ADD_ITEMS = '@nodes/ADD_ITEMS';
export const FINISH_IS_LOADING = '@nodes/FINISH_IS_LOADING';

export const SET_WORK_IN_PROGRESS_ITEM = '@nodes/SET_WORK_IN_PROGRESS_ITEM';
export const SET_WORK_IN_PROGRESS_ITEM_IDS =
  '@nodes/SET_WORK_IN_PROGRESS_ITEM_IDS';
export const SET_WORK_IN_PROGRESS_LIST_ID =
  '@nodes/SET_WORK_IN_PROGRESS_LIST_ID';

export const RESET_WORK_IN_PROGRESS_ITEM_IDS =
  '@nodes/RESET_WORK_IN_PROGRESS_ITEM_IDS';

export const REMOVE_ITEM_REQUEST = '@nodes/REMOVE_ITEM_REQUEST';
export const REMOVE_ITEM_SUCCESS = '@nodes/REMOVE_ITEM_SUCCESS';
export const REMOVE_ITEM_FAILURE = '@nodes/REMOVE_ITEM_FAILURE';

export const REMOVE_ITEMS_BATCH_REQUEST = '@nodes/REMOVE_ITEMS_BATCH_REQUEST';
export const REMOVE_ITEMS_BATCH_SUCCESS = '@nodes/REMOVE_ITEMS_BATCH_SUCCESS';
export const REMOVE_ITEMS_BATCH_FAILURE = '@nodes/REMOVE_ITEMS_BATCH_FAILURE';

export const MOVE_ITEM_REQUEST = '@nodes/MOVE_ITEM_REQUEST';
export const MOVE_ITEM_SUCCESS = '@nodes/MOVE_ITEM_SUCCESS';
export const MOVE_ITEM_FAILURE = '@nodes/MOVE_ITEM_FAILURE';

export const MOVE_ITEMS_BATCH_REQUEST = '@nodes/MOVE_ITEMS_BATCH_REQUEST';
export const MOVE_ITEMS_BATCH_SUCCESS = '@nodes/MOVE_ITEMS_BATCH_SUCCESS';
export const MOVE_ITEMS_BATCH_FAILURE = '@nodes/MOVE_ITEMS_BATCH_FAILURE';

export const SHARE_ITEMS = '@nodes/SHARE_ITEMS';

export const CREATE_ITEM_REQUEST = '@nodes/CREATE_ITEM_REQUEST';
export const CREATE_ITEM_SUCCESS = '@nodes/CREATE_ITEM_SUCCESS';
export const CREATE_ITEM_FAILURE = '@nodes/CREATE_ITEM_FAILURE';

export const CREATE_ITEMS_BATCH_REQUEST = '@nodes/CREATE_ITEMS_BATCH_REQUEST';
export const CREATE_ITEMS_BATCH_SUCCESS = '@nodes/CREATE_ITEMS_BATCH_SUCCESS';
export const CREATE_ITEMS_BATCH_FAILURE = '@nodes/CREATE_ITEMS_BATCH_FAILURE';

export const EDIT_ITEM_REQUEST = '@nodes/EDIT_ITEM_REQUEST';
export const EDIT_ITEM_SUCCESS = '@nodes/EDIT_ITEM_SUCCESS';
export const EDIT_ITEM_FAILURE = '@nodes/EDIT_ITEM_FAILURE';

export const ACCEPT_ITEM_UPDATE_REQUEST = '@nodes/ACCEPT_ITEM_UPDATE_REQUEST';
export const ACCEPT_ITEM_UPDATE_SUCCESS = '@nodes/ACCEPT_ITEM_UPDATE_SUCCESS';
export const ACCEPT_ITEM_UPDATE_FAILURE = '@nodes/ACCEPT_ITEM_UPDATE_FAILURE';

export const REJECT_ITEM_UPDATE_REQUEST = '@nodes/REJECT_ITEM_UPDATE_REQUEST';
export const REJECT_ITEM_UPDATE_SUCCESS = '@nodes/REJECT_ITEM_UPDATE_SUCCESS';
export const REJECT_ITEM_UPDATE_FAILURE = '@nodes/REJECT_ITEM_UPDATE_FAILURE';

export const TOGGLE_ITEM_TO_FAVORITE_REQUEST =
  '@nodes/TOGGLE_ITEM_TO_FAVORITE_REQUEST';
export const TOGGLE_ITEM_TO_FAVORITE_SUCCESS =
  '@nodes/TOGGLE_ITEM_TO_FAVORITE_SUCCESS';
export const TOGGLE_ITEM_TO_FAVORITE_FAILURE =
  '@nodes/TOGGLE_ITEM_TO_FAVORITE_FAILURE';

export const CHANGE_ITEM_PERMISSION_REQUEST =
  '@nodes/CHANGE_ITEM_PERMISSION_REQUEST';
export const CHANGE_ITEM_PERMISSION_SUCCESS =
  '@nodes/CHANGE_ITEM_PERMISSION_SUCCESS';
export const CHANGE_ITEM_PERMISSION_FAILURE =
  '@nodes/CHANGE_ITEM_PERMISSION_FAILURE';

export const INVITE_MEMBER_REQUEST = '@nodes/INVITE_MEMBER_REQUEST';
export const INVITE_MEMBER_SUCCESS = '@nodes/INVITE_MEMBER_SUCCESS';
export const INVITE_MEMBER_FAILURE = '@nodes/INVITE_MEMBER_FAILURE';

export const REMOVE_INVITE_REQUEST = '@nodes/REMOVE_INVITE_REQUEST';
export const REMOVE_INVITE_SUCCESS = '@nodes/REMOVE_INVITE_SUCCESS';
export const REMOVE_INVITE_FAILURE = '@nodes/REMOVE_INVITE_FAILURE';

export const INVITE_NEW_MEMBER_REQUEST = '@nodes/INVITE_NEW_MEMBER_REQUEST';
export const INVITE_NEW_MEMBER_SUCCESS = '@nodes/INVITE_NEW_MEMBER_SUCCESS';
export const INVITE_NEW_MEMBER_FAILURE = '@nodes/INVITE_NEW_MEMBER_FAILURE';

export const SHARE_ITEM_REQUEST = '@nodes/SHARE_ITEM_REQUEST';
export const SHARE_ITEM_SUCCESS = '@nodes/SHARE_ITEM_SUCCESS';
export const SHARE_ITEM_FAILURE = '@nodes/SHARE_ITEM_FAILURE';

export const REMOVE_SHARE_REQUEST = '@nodes/REMOVE_SHARE_REQUEST';
export const REMOVE_SHARE_SUCCESS = '@nodes/REMOVE_SHARE_SUCCESS';
export const REMOVE_SHARE_FAILURE = '@nodes/REMOVE_SHARE_FAILURE';

export const CREATE_ANONYMOUS_LINK_REQUEST =
  '@nodes/CREATE_ANONYMOUS_LINK_REQUEST';
export const CREATE_ANONYMOUS_LINK_SUCCESS =
  '@nodes/CREATE_ANONYMOUS_LINK_SUCCESS';
export const CREATE_ANONYMOUS_LINK_FAILURE =
  '@nodes/CREATE_ANONYMOUS_LINK_FAILURE';

export const REMOVE_ANONYMOUS_LINK_REQUEST =
  '@nodes/REMOVE_ANONYMOUS_LINK_REQUEST';
export const REMOVE_ANONYMOUS_LINK_SUCCESS =
  '@nodes/REMOVE_ANONYMOUS_LINK_SUCCESS';
export const REMOVE_ANONYMOUS_LINK_FAILURE =
  '@nodes/REMOVE_ANONYMOUS_LINK_FAILURE';

export const CREATE_LIST_REQUEST = '@nodes/CREATE_LIST_REQUEST';
export const CREATE_LIST_SUCCESS = '@nodes/CREATE_LIST_SUCCESS';
export const CREATE_LIST_FAILURE = '@nodes/CREATE_LIST_FAILURE';

export const EDIT_LIST_REQUEST = '@nodes/EDIT_LIST_REQUEST';
export const EDIT_LIST_SUCCESS = '@nodes/EDIT_LIST_SUCCESS';
export const EDIT_LIST_FAILURE = '@nodes/EDIT_LIST_FAILURE';

export const REMOVE_LIST_REQUEST = '@nodes/REMOVE_LIST_REQUEST';
export const REMOVE_LIST_SUCCESS = '@nodes/REMOVE_LIST_SUCCESS';
export const REMOVE_LIST_FAILURE = '@nodes/REMOVE_LIST_FAILURE';

export const SORT_LIST_REQUEST = '@nodes/SORT_LIST_REQUEST';
export const SORT_LIST_SUCCESS = '@nodes/SORT_LIST_SUCCESS';
export const SORT_LIST_FAILURE = '@nodes/SORT_LIST_FAILURE';

export const RESET_STORE = '@nodes/RESET_STORE';

export const fetchNodesRequest = withItemsDecryption => ({
  type: FETCH_NODES_REQUEST,
  payload: {
    withItemsDecryption,
  },
});

export const fetchNodesSuccess = listsById => ({
  type: FETCH_NODES_SUCCESS,
  payload: {
    listsById,
  },
});

export const fetchNodesFailure = () => ({
  type: FETCH_NODES_FAILURE,
});

export const addItems = items => ({
  type: ADD_ITEMS,
  payload: {
    items,
  },
});

export const finishIsLoading = () => ({
  type: FINISH_IS_LOADING,
});

export const setWorkInProgressItem = (item, mode) => ({
  type: SET_WORK_IN_PROGRESS_ITEM,
  payload: {
    item,
    mode,
  },
});

export const setWorkInProgressItemIds = itemIds => ({
  type: SET_WORK_IN_PROGRESS_ITEM_IDS,
  payload: {
    itemIds,
  },
});

export const setWorkInProgressListId = listId => ({
  type: SET_WORK_IN_PROGRESS_LIST_ID,
  payload: {
    listId,
  },
});

export const resetWorkInProgressItemIds = () => ({
  type: RESET_WORK_IN_PROGRESS_ITEM_IDS,
});

export const moveItemsBatchRequest = (oldListId, newListId) => ({
  type: MOVE_ITEMS_BATCH_REQUEST,
  payload: {
    oldListId,
    newListId,
  },
});

export const moveItemsBatchSuccess = (itemIds, oldListId, newListId) => ({
  type: MOVE_ITEMS_BATCH_SUCCESS,
  payload: {
    itemIds,
    oldListId,
    newListId,
  },
});

export const moveItemsBatchFailure = () => ({
  type: MOVE_ITEMS_BATCH_FAILURE,
});

export const shareItems = emails => ({
  type: SHARE_ITEMS,
  payload: {
    emails,
  },
});

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

export const moveItemRequest = listId => ({
  type: MOVE_ITEM_REQUEST,
  payload: {
    listId,
  },
});

export const moveItemSuccess = (itemId, oldListId, newListId) => ({
  type: MOVE_ITEM_SUCCESS,
  payload: {
    itemId,
    oldListId,
    newListId,
  },
});

export const moveItemFailure = () => ({
  type: MOVE_ITEM_FAILURE,
});

export const createItemRequest = (item, setSubmitting) => ({
  type: CREATE_ITEM_REQUEST,
  payload: {
    item,
  },
  meta: {
    setSubmitting,
  },
});

export const createItemSuccess = item => ({
  type: CREATE_ITEM_SUCCESS,
  payload: {
    item,
  },
});

export const createItemFailure = () => ({
  type: CREATE_ITEM_FAILURE,
});

export const createItemsBatchRequest = (listId, items) => ({
  type: CREATE_ITEMS_BATCH_REQUEST,
  payload: {
    listId,
    items,
  },
});

export const createItemsBatchSuccess = items => ({
  type: CREATE_ITEMS_BATCH_SUCCESS,
  payload: {
    items,
  },
});

export const createItemsBatchFailure = () => ({
  type: CREATE_ITEMS_BATCH_FAILURE,
});

export const editItemRequest = (item, setSubmitting) => ({
  type: EDIT_ITEM_REQUEST,
  payload: {
    item,
  },
  meta: {
    setSubmitting,
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

export const acceptItemUpdateRequest = id => ({
  type: ACCEPT_ITEM_UPDATE_REQUEST,
  payload: {
    id,
  },
});

export const acceptItemUpdateSuccess = item => ({
  type: ACCEPT_ITEM_UPDATE_SUCCESS,
  payload: {
    item,
  },
});

export const acceptItemUpdateFailure = () => ({
  type: REJECT_ITEM_UPDATE_FAILURE,
});

export const rejectItemUpdateRequest = id => ({
  type: ACCEPT_ITEM_UPDATE_REQUEST,
  payload: {
    id,
  },
});

export const rejectItemUpdateSuccess = itemId => ({
  type: REJECT_ITEM_UPDATE_SUCCESS,
  payload: {
    itemId,
  },
});

export const rejectItemUpdateFailure = () => ({
  type: REJECT_ITEM_UPDATE_FAILURE,
});

export const toggleItemToFavoriteRequest = itemId => ({
  type: TOGGLE_ITEM_TO_FAVORITE_REQUEST,
  payload: {
    itemId,
  },
});

export const toggleItemToFavoriteSuccess = (
  itemId,
  favoritesListId,
  isFavorite,
) => ({
  type: TOGGLE_ITEM_TO_FAVORITE_SUCCESS,
  payload: {
    itemId,
    favoritesListId,
    isFavorite,
  },
});

export const toggleItemToFavoriteFailure = () => ({
  type: TOGGLE_ITEM_TO_FAVORITE_FAILURE,
});

export const changeItemPermissionRequest = (userId, permission) => ({
  type: CHANGE_ITEM_PERMISSION_REQUEST,
  payload: {
    userId,
    permission,
  },
});

export const changeItemPermissionSuccess = (itemId, userId, permission) => ({
  type: CHANGE_ITEM_PERMISSION_SUCCESS,
  payload: {
    itemId,
    userId,
    permission,
  },
});

export const changeItemPermissionFailure = () => ({
  type: CHANGE_ITEM_PERMISSION_FAILURE,
});

export const inviteMemberRequest = userId => ({
  type: INVITE_MEMBER_REQUEST,
  payload: {
    userId,
  },
});

export const inviteMemberSuccess = (itemId, childItemId, member) => ({
  type: INVITE_MEMBER_SUCCESS,
  payload: {
    itemId,
    childItemId,
    member,
  },
});

export const inviteMemberFailure = () => ({
  type: INVITE_MEMBER_FAILURE,
});

export const removeInviteMemberRequest = userId => ({
  type: REMOVE_INVITE_REQUEST,
  payload: {
    userId,
  },
});

export const removeInviteMemberSuccess = (itemId, userId) => ({
  type: REMOVE_INVITE_SUCCESS,
  payload: {
    itemId,
    userId,
  },
});

export const removeInviteMemberFailure = () => ({
  type: REMOVE_INVITE_FAILURE,
});

export const inviteNewMemberRequest = email => ({
  type: INVITE_NEW_MEMBER_REQUEST,
  payload: {
    email,
  },
});

export const inviteNewMemberSuccess = member => ({
  type: INVITE_NEW_MEMBER_SUCCESS,
  payload: {
    member,
  },
});

export const inviteNewMemberFailure = () => ({
  type: INVITE_NEW_MEMBER_FAILURE,
});

export const shareItemRequest = (item, emails) => ({
  type: SHARE_ITEM_REQUEST,
  payload: {
    item,
    emails,
  },
});

export const shareItemSuccess = (itemId, invited) => ({
  type: SHARE_ITEM_SUCCESS,
  payload: {
    itemId,
    invited,
  },
});

export const shareItemFailure = () => ({
  type: SHARE_ITEM_FAILURE,
});

export const removeShareRequest = shareId => ({
  type: REMOVE_SHARE_REQUEST,
  payload: {
    shareId,
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

export const createListRequest = list => ({
  type: CREATE_LIST_REQUEST,
  payload: {
    list,
  },
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

export const editListRequest = list => ({
  type: EDIT_LIST_REQUEST,
  payload: {
    list,
  },
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

export const resetStore = () => ({
  type: RESET_STORE,
});
