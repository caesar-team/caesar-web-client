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

export const ADD_TEAM_MEMBERS_BATCH_REQUEST =
  '@member/ADD_TEAM_MEMBERS_BATCH_REQUEST';
export const ADD_TEAM_MEMBERS_BATCH_SUCCESS =
  '@member/ADD_TEAM_MEMBERS_BATCH_SUCCESS';
export const ADD_TEAM_MEMBERS_BATCH_FAILURE =
  '@member/ADD_TEAM_MEMBERS_BATCH_FAILURE';

export const UPDATE_TEAM_MEMBER_ROLE_REQUEST =
  '@member/UPDATE_TEAM_MEMBER_ROLE_REQUEST';
export const UPDATE_TEAM_MEMBER_ROLE_SUCCESS =
  '@member/UPDATE_TEAM_MEMBER_ROLE_SUCCESS';
export const UPDATE_TEAM_MEMBER_ROLE_FAILURE =
  '@member/UPDATE_TEAM_MEMBER_ROLE_FAILURE';

export const REMOVE_TEAM_MEMBER_REQUEST = '@member/REMOVE_TEAM_MEMBER_REQUEST';
export const REMOVE_TEAM_MEMBER_SUCCESS = '@member/REMOVE_TEAM_MEMBER_SUCCESS';
export const REMOVE_TEAM_MEMBER_FAILURE = '@member/REMOVE_TEAM_MEMBER_FAILURE';

export const RESET_MEMBER_STATE = '@member/RESET_MEMBER_STATE';

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

export const addTeamMembersBatchRequest = (teamId, users) => ({
  type: ADD_TEAM_MEMBERS_BATCH_REQUEST,
  payload: {
    teamId,
    users,
  },
});

export const addTeamMembersBatchSuccess = members => ({
  type: ADD_TEAM_MEMBERS_BATCH_SUCCESS,
  payload: {
    members,
  },
});

export const addTeamMembersBatchFailure = () => ({
  type: ADD_TEAM_MEMBERS_BATCH_FAILURE,
});

export const updateTeamMemberRoleRequest = (memberId, teamRole) => ({
  type: UPDATE_TEAM_MEMBER_ROLE_REQUEST,
  payload: {
    memberId,
    teamRole,
  },
});

export const updateTeamMemberRoleSuccess = (memberId, teamRole) => ({
  type: UPDATE_TEAM_MEMBER_ROLE_SUCCESS,
  payload: {
    memberId,
    teamRole,
  },
});

export const updateTeamMemberRoleFailure = () => ({
  type: UPDATE_TEAM_MEMBER_ROLE_FAILURE,
});

export const removeTeamMemberRequest = memberId => ({
  type: REMOVE_TEAM_MEMBER_REQUEST,
  payload: {
    memberId,
  },
});

export const removeTeamMemberSuccess = memberId => ({
  type: REMOVE_TEAM_MEMBER_SUCCESS,
  payload: {
    memberId,
  },
});

export const removeTeamMemberFailure = () => ({
  type: REMOVE_TEAM_MEMBER_FAILURE,
});

export const resetMemberState = () => ({
  type: RESET_MEMBER_STATE,
});
