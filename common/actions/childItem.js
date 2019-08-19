export const INVITE_MEMBER_REQUEST = '@childItem/INVITE_MEMBER_REQUEST';
export const INVITE_MEMBER_SUCCESS = '@childItem/INVITE_MEMBER_SUCCESS';
export const INVITE_MEMBER_FAILURE = '@childItem/INVITE_MEMBER_FAILURE';

export const REMOVE_INVITE_REQUEST = '@childItem/REMOVE_INVITE_REQUEST';
export const REMOVE_INVITE_SUCCESS = '@childItem/REMOVE_INVITE_SUCCESS';
export const REMOVE_INVITE_FAILURE = '@childItem/REMOVE_INVITE_FAILURE';

export const INVITE_NEW_MEMBER_REQUEST = '@childItem/INVITE_NEW_MEMBER_REQUEST';
export const INVITE_NEW_MEMBER_SUCCESS = '@childItem/INVITE_NEW_MEMBER_SUCCESS';
export const INVITE_NEW_MEMBER_FAILURE = '@childItem/INVITE_NEW_MEMBER_FAILURE';

export const SHARE_ITEM_REQUEST = '@childItem/SHARE_ITEM_REQUEST';
export const SHARE_ITEM_SUCCESS = '@childItem/SHARE_ITEM_SUCCESS';
export const SHARE_ITEM_FAILURE = '@childItem/SHARE_ITEM_FAILURE';

export const SHARE_ITEM_BATCH_REQUEST = '@childItem/SHARE_ITEM_BATCH_REQUEST';
export const SHARE_ITEM_BATCH_SUCCESS = '@childItem/SHARE_ITEM_BATCH_SUCCESS';
export const SHARE_ITEM_BATCH_FAILURE = '@childItem/SHARE_ITEM_BATCH_FAILURE';

export const REMOVE_SHARE_REQUEST = '@childItem/REMOVE_SHARE_REQUEST';
export const REMOVE_SHARE_SUCCESS = '@childItem/REMOVE_SHARE_SUCCESS';
export const REMOVE_SHARE_FAILURE = '@childItem/REMOVE_SHARE_FAILURE';

export const CHANGE_CHILD_ITEM_PERMISSION_REQUEST =
  '@childItem/CHANGE_CHILD_ITEM_PERMISSION_REQUEST';
export const CHANGE_CHILD_ITEM_PERMISSION_SUCCESS =
  '@childItem/CHANGE_CHILD_ITEM_PERMISSION_SUCCESS';
export const CHANGE_CHILD_ITEM_PERMISSION_FAILURE =
  '@childItem/CHANGE_CHILD_ITEM_PERMISSION_FAILURE';

export const ADD_CHILD_ITEMS_BATCH = '@childItem/ADD_CHILD_ITEMS_BATCH';
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

export const removeInviteMemberRequest = userId => ({
  type: REMOVE_INVITE_REQUEST,
  payload: {
    userId,
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

export const shareItemBatchRequest = (items, emails) => ({
  type: SHARE_ITEM_BATCH_REQUEST,
  payload: {
    items,
    emails,
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

export const changeChildItemPermissionRequest = (userId, permission) => ({
  type: CHANGE_CHILD_ITEM_PERMISSION_REQUEST,
  payload: {
    userId,
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

export const addChildItemsBatch = (itemId, childItemsById) => ({
  type: ADD_CHILD_ITEMS_BATCH,
  payload: {
    itemId,
    childItemsById,
  },
});

export const resetStore = () => ({
  type: RESET_STORE,
});
