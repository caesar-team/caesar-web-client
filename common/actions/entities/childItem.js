export const INVITE_MEMBER_REQUEST = '@childItem/INVITE_MEMBER_REQUEST';
export const INVITE_MEMBER_SUCCESS = '@childItem/INVITE_MEMBER_SUCCESS';
export const INVITE_MEMBER_FAILURE = '@childItem/INVITE_MEMBER_FAILURE';

export const REMOVE_INVITE_REQUEST = '@childItem/REMOVE_INVITE_REQUEST';
export const REMOVE_INVITE_SUCCESS = '@childItem/REMOVE_INVITE_SUCCESS';
export const REMOVE_INVITE_FAILURE = '@childItem/REMOVE_INVITE_FAILURE';

export const INVITE_NEW_MEMBER_REQUEST = '@childItem/INVITE_NEW_MEMBER_REQUEST';
export const INVITE_NEW_MEMBER_FAILURE = '@childItem/INVITE_NEW_MEMBER_FAILURE';

export const SHARE_ITEM_BATCH_REQUEST = '@childItem/SHARE_ITEM_BATCH_REQUEST';
export const SHARE_ITEM_BATCH_SUCCESS = '@childItem/SHARE_ITEM_BATCH_SUCCESS';
export const SHARE_ITEM_BATCH_FAILURE = '@childItem/SHARE_ITEM_BATCH_FAILURE';

export const REMOVE_SHARE_REQUEST = '@childItem/REMOVE_SHARE_REQUEST';
export const REMOVE_SHARE_SUCCESS = '@childItem/REMOVE_SHARE_SUCCESS';
export const REMOVE_SHARE_FAILURE = '@childItem/REMOVE_SHARE_FAILURE';

export const UPDATE_CHILD_ITEM_BATCH_REQUEST =
  '@childItem/UPDATE_CHILD_ITEM_BATCH_REQUEST';
export const UPDATE_CHILD_ITEM_BATCH_FAILURE =
  '@childItem/UPDATE_CHILD_ITEM_BATCH_FAILURE';

export const CHANGE_CHILD_ITEM_PERMISSION_REQUEST =
  '@childItem/CHANGE_CHILD_ITEM_PERMISSION_REQUEST';
export const CHANGE_CHILD_ITEM_PERMISSION_SUCCESS =
  '@childItem/CHANGE_CHILD_ITEM_PERMISSION_SUCCESS';
export const CHANGE_CHILD_ITEM_PERMISSION_FAILURE =
  '@childItem/CHANGE_CHILD_ITEM_PERMISSION_FAILURE';

export const ADD_CHILD_ITEMS_BATCH = '@childItem/ADD_CHILD_ITEMS_BATCH';
export const REMOVE_CHILD_ITEMS_BATCH = '@childItem/REMOVE_CHILD_ITEMS_BATCH';
export const RESET_STORE = '@childItem/RESET_STORE';

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

export const removeInviteMemberRequest = childItemId => ({
  type: REMOVE_INVITE_REQUEST,
  payload: {
    childItemId,
  },
});

export const removeInviteMemberSuccess = childItemId => ({
  type: REMOVE_INVITE_SUCCESS,
  payload: {
    childItemId,
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

export const inviteNewMemberFailure = () => ({
  type: INVITE_NEW_MEMBER_FAILURE,
});

export const shareItemBatchRequest = (items, members) => ({
  type: SHARE_ITEM_BATCH_REQUEST,
  payload: {
    items,
    members,
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

export const updateChildItemsBatchFailure = () => ({
  type: UPDATE_CHILD_ITEM_BATCH_FAILURE,
});

export const changeChildItemPermissionRequest = (childItemId, permission) => ({
  type: CHANGE_CHILD_ITEM_PERMISSION_REQUEST,
  payload: {
    childItemId,
    permission,
  },
});

export const changeChildItemPermissionSuccess = (childItemId, permission) => ({
  type: CHANGE_CHILD_ITEM_PERMISSION_SUCCESS,
  payload: {
    childItemId,
    permission,
  },
});

export const changeChildItemPermissionFailure = () => ({
  type: CHANGE_CHILD_ITEM_PERMISSION_FAILURE,
});

export const addChildItemsBatch = childItemsById => ({
  type: ADD_CHILD_ITEMS_BATCH,
  payload: {
    childItemsById,
  },
});

export const removeChildItemsBatch = childItemIds => ({
  type: REMOVE_CHILD_ITEMS_BATCH,
  payload: {
    childItemIds,
  },
});
