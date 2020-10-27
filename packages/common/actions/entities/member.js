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

export const ADD_MEMBERS_BATCH = '@member/ADD_MEMBERS_BATCH';
export const REMOVE_TEAM_FROM_MEMBER = '@member/REMOVE_TEAM_FROM_MEMBER';
export const REMOVE_TEAM_FROM_MEMBERS_BATCH =
  '@member/REMOVE_TEAM_FROM_MEMBERS_BATCH';

export const RESET_MEMBER_STATE = '@member/RESET_MEMBER_STATE';

export const LEAVE_TEAM_REQUEST = '@team/LEAVE_TEAM_REQUEST';
export const LEAVE_TEAM_SUCCESS = '@team/LEAVE_TEAM_SUCCESS';
export const LEAVE_TEAM_FAILURE = '@team/LEAVE_TEAM_FAILURE';

export const fetchTeamMembersRequest = ({
  teamId,
  needUpdateTeamMembers = false,
}) => ({
  type: FETCH_TEAM_MEMBERS_REQUEST,
  payload: {
    needUpdateTeamMembers,
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

export const addMembersBatch = membersById => ({
  type: ADD_MEMBERS_BATCH,
  payload: {
    membersById,
  },
});

// @Deprecated
export const removeTeamFromMember = (teamId, memberId) => ({
  type: REMOVE_TEAM_FROM_MEMBER,
  payload: {
    memberId,
    teamId,
  },
});

// @Deprecated
export const removeTeamFromMembersBatch = (teamId, memberIds) => ({
  type: REMOVE_TEAM_FROM_MEMBERS_BATCH,
  payload: {
    teamId,
    memberIds,
  },
});

export const leaveTeamRequest = teamId => ({
  type: LEAVE_TEAM_REQUEST,
  payload: {
    teamId,
  },
});

export const leaveTeamSuccess = teamId => ({
  type: LEAVE_TEAM_SUCCESS,
  payload: {
    teamId,
  },
});

export const leaveTeamFailure = () => ({
  type: LEAVE_TEAM_FAILURE,
});

export const resetMemberState = () => ({
  type: RESET_MEMBER_STATE,
});
