export const FETCH_MEMBERS_REQUEST = '@member/FETCH_MEMBERS_REQUEST';
export const FETCH_MEMBERS_SUCCESS = '@member/FETCH_MEMBERS_SUCCESS';
export const FETCH_MEMBERS_FAILURE = '@member/FETCH_MEMBERS_FAILURE';

export const CREATE_MEMBER_REQUEST = '@member/CREATE_MEMBER_REQUEST';
export const CREATE_MEMBER_SUCCESS = '@member/CREATE_MEMBER_SUCCESS';
export const CREATE_MEMBER_FAILURE = '@member/CREATE_MEMBER_FAILURE';

export const CREATE_MEMBER_BATCH_REQUEST =
  '@member/CREATE_MEMBER_BATCH_REQUEST';
export const CREATE_MEMBER_BATCH_SUCCESS =
  '@member/CREATE_MEMBER_BATCH_SUCCESS';
export const CREATE_MEMBER_BATCH_FAILURE =
  '@member/CREATE_MEMBER_BATCH_FAILURE';

export const FETCH_TEAM_MEMBERS_REQUEST = '@member/FETCH_TEAM_MEMBERS_REQUEST';
export const FETCH_TEAM_MEMBERS_SUCCESS = '@member/FETCH_TEAM_MEMBERS_SUCCESS';
export const FETCH_TEAM_MEMBERS_FAILURE = '@member/FETCH_TEAM_MEMBERS_FAILURE';

export const ADD_MEMBERS_BATCH = '@member/ADD_MEMBERS';

export const fetchMembersRequest = memberIds => ({
  type: FETCH_MEMBERS_REQUEST,
  payload: {
    memberIds,
  },
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

export const fetchTeamMembersRequest = teamId => ({
  type: FETCH_TEAM_MEMBERS_REQUEST,
  payload: {
    teamId,
  },
});

export const fetchTeamMembersSuccess = membersById => ({
  type: FETCH_TEAM_MEMBERS_SUCCESS,
  payload: {
    membersById,
  },
});

export const fetchTeamMembersFailure = () => ({
  type: FETCH_TEAM_MEMBERS_FAILURE,
});

export const addMembersBatch = membersById => ({
  type: ADD_MEMBERS_BATCH,
  payload: {
    membersById,
  },
});
