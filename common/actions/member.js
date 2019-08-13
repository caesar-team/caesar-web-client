export const FETCH_MEMBERS_REQUEST = '@members/FETCH_MEMBERS_REQUEST';
export const FETCH_MEMBERS_SUCCESS = '@members/FETCH_MEMBERS_SUCCESS';
export const FETCH_MEMBERS_FAILURE = '@members/FETCH_MEMBERS_FAILURE';

export const CREATE_MEMBER_REQUEST = '@members/CREATE_MEMBER_REQUEST';
export const CREATE_MEMBER_SUCCESS = '@members/CREATE_MEMBER_SUCCESS';
export const CREATE_MEMBER_FAILURE = '@members/CREATE_MEMBER_FAILURE';

export const CREATE_MEMBER_BATCH_REQUEST =
  '@members/CREATE_MEMBER_BATCH_REQUEST';
export const CREATE_MEMBER_BATCH_SUCCESS =
  '@members/CREATE_MEMBER_BATCH_SUCCESS';
export const CREATE_MEMBER_BATCH_FAILURE =
  '@members/CREATE_MEMBER_BATCH_FAILURE';

export const fetchMembersRequest = () => ({
  type: FETCH_MEMBERS_REQUEST,
});

export const fetchMembersSuccess = membersById => ({
  type: FETCH_MEMBERS_SUCCESS,
  payload: {
    membersById,
  },
});

export const fetchMembersFailure = () => ({
  type: FETCH_MEMBERS_FAILURE,
});

export const createMemberRequest = (email, role) => ({
  type: CREATE_MEMBER_REQUEST,
  payload: {
    email,
    role,
  },
});

export const createMemberSuccess = member => ({
  type: CREATE_MEMBER_SUCCESS,
  payload: {
    member,
  },
});

export const createMemberFailure = () => ({
  type: CREATE_MEMBER_FAILURE,
});

export const createMemberBatchRequest = (email, role) => ({
  type: CREATE_MEMBER_BATCH_REQUEST,
  payload: {
    email,
    role,
  },
});

export const createMemberBatchSuccess = members => ({
  type: CREATE_MEMBER_BATCH_SUCCESS,
  payload: {
    members,
  },
});

export const createMemberBatchFailure = () => ({
  type: CREATE_MEMBER_BATCH_FAILURE,
});
