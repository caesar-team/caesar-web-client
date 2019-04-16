export const FETCH_NODES_REQUEST = '@nodes/FETCH_NODES_REQUEST';
export const FETCH_NODES_SUCCESS = '@nodes/FETCH_NODES_SUCCESS';
export const FETCH_NODES_FAILURE = '@nodes/FETCH_NODES_FAILURE';

export const ADD_ITEM = '@nodes/ADD_ITEM';

export const SET_WORK_IN_PROGRESS_ITEM = '@nodes/SET_WORK_IN_PROGRESS_ITEM';
export const SET_WORK_IN_PROGRESS_LIST_ID =
  '@nodes/SET_WORK_IN_PROGRESS_LIST_ID';

export const REMOVE_ITEM_REQUEST = '@nodes/REMOVE_ITEM_REQUEST';
export const REMOVE_ITEM_SUCCESS = '@nodes/REMOVE_ITEM_SUCCESS';
export const REMOVE_ITEM_FAILURE = '@nodes/REMOVE_ITEM_FAILURE';

export const MOVE_ITEM_REQUEST = '@nodes/MOVE_ITEM_REQUEST';
export const MOVE_ITEM_SUCCESS = '@nodes/MOVE_ITEM_SUCCESS';
export const MOVE_ITEM_FAILURE = '@nodes/MOVE_ITEM_FAILURE';

export const CREATE_ITEM_REQUEST = '@nodes/CREATE_ITEM_REQUEST';
export const CREATE_ITEM_SUCCESS = '@nodes/CREATE_ITEM_SUCCESS';
export const CREATE_ITEM_FAILURE = '@nodes/CREATE_ITEM_FAILURE';

export const EDIT_ITEM_REQUEST = '@nodes/EDIT_ITEM_REQUEST';
export const EDIT_ITEM_SUCCESS = '@nodes/EDIT_ITEM_SUCCESS';
export const EDIT_ITEM_FAILURE = '@nodes/EDIT_ITEM_FAILURE';

export const ACCEPT_ITEM_UPDATE_REQUEST = '@nodes/ACCEPT_ITEM_UPDATE_REQUEST';
export const ACCEPT_ITEM_UPDATE_SUCCESS = '@nodes/ACCEPT_ITEM_UPDATE_SUCCESS';
export const ACCEPT_ITEM_UPDATE_FAILURE = '@nodes/ACCEPT_ITEM_UPDATE_FAILURE';

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

export const fetchNodesRequest = () => ({
  type: FETCH_NODES_REQUEST,
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

export const addItem = item => ({
  type: ADD_ITEM,
  payload: {
    item,
  },
});

export const setWorkInProgressItem = (item, mode) => ({
  type: SET_WORK_IN_PROGRESS_ITEM,
  payload: {
    item,
    mode,
  },
});

export const setWorkInProgressListId = listId => ({
  type: SET_WORK_IN_PROGRESS_LIST_ID,
  payload: {
    listId,
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
  type: ACCEPT_ITEM_UPDATE_FAILURE,
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

export const shareItemRequest = emails => ({
  type: SHARE_ITEM_REQUEST,
  payload: {
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
