export const FETCH_USER_SELF_REQUEST = '@user/FETCH_USER_SELF_REQUEST';
export const FETCH_USER_SELF_SUCCESS = '@user/FETCH_USER_SELF_SUCCESS';
export const FETCH_USER_SELF_FAILURE = '@user/FETCH_USER_SELF_FAILURE';

export const FETCH_KEY_PAIR_REQUEST = '@user/FETCH_KEY_PAIR_REQUEST';
export const FETCH_KEY_PAIR_SUCCESS = '@user/FETCH_KEY_PAIR_SUCCESS';
export const FETCH_KEY_PAIR_FAILURE = '@user/FETCH_KEY_PAIR_FAILURE';

export const FETCH_USER_TEAMS_REQUEST = '@user/FETCH_USER_TEAMS_REQUEST';
export const FETCH_USER_TEAMS_SUCCESS = '@user/FETCH_USER_TEAMS_SUCCESS';
export const FETCH_USER_TEAMS_FAILURE = '@user/FETCH_USER_TEAMS_FAILURE';

export const SET_MASTER_PASSWORD = '@user/SET_MASTER_PASSWORD';
export const SET_KEY_PAIR = '@user/SET_KEY_PAIR';
export const SET_CURRENT_TEAM_ID = '@user/SET_CURRENT_TEAM_ID';

export const ADD_MEMBER_TO_TEAM = '@user/ADD_MEMBER_TO_TEAM';
export const LEAVE_TEAM = '@user/LEAVE_TEAM';

export const LOGOUT = '@user/LOGOUT';

export const fetchUserSelfRequest = () => ({
  type: FETCH_USER_SELF_REQUEST,
});

export const fetchUserSelfSuccess = data => ({
  type: FETCH_USER_SELF_SUCCESS,
  payload: {
    data,
  },
});

export const fetchUserSelfFailure = () => ({
  type: FETCH_USER_SELF_FAILURE,
});

export const fetchKeyPairRequest = () => ({
    type: FETCH_KEY_PAIR_REQUEST,
});

export const fetchKeyPairSuccess = keyPair => ({
  type: FETCH_KEY_PAIR_SUCCESS,
  payload: {
    keyPair,
  },
});

export const fetchKeyPairFailure = () => ({
  type: FETCH_KEY_PAIR_FAILURE,
});

export const fetchUserTeamsRequest = () => ({
  type: FETCH_USER_TEAMS_REQUEST,
});

export const fetchUserTeamsSuccess = teamIds => ({
  type: FETCH_USER_TEAMS_SUCCESS,
  payload: {
    teamIds,
  },
});

export const fetchUserTeamsFailure = () => ({
  type: FETCH_USER_TEAMS_FAILURE,
});

export const setMasterPassword = masterPassword => ({
  type: SET_MASTER_PASSWORD,
  payload: {
    masterPassword,
  },
});

export const setKeyPair = keyPair => ({
  type: SET_KEY_PAIR,
  payload: {
    keyPair,
  },
});

export const setCurrentTeamId = (teamId, withDecryption) => ({
  type: SET_CURRENT_TEAM_ID,
  payload: {
    teamId,
    withDecryption,
  },
});

export const addMemberToTeam = teamId => ({
  type: ADD_MEMBER_TO_TEAM,
  payload: {
    teamId,
  },
});

export const leaveTeam = teamId => ({
  type: LEAVE_TEAM,
  payload: {
    teamId,
  },
});

export const logout = () => ({
  type: LOGOUT,
});
