export const FETCH_USER_SELF_REQUEST = '@currentUser/FETCH_USER_SELF_REQUEST';
export const FETCH_USER_SELF_SUCCESS = '@currentUser/FETCH_USER_SELF_SUCCESS';
export const FETCH_USER_SELF_FAILURE = '@currentUser/FETCH_USER_SELF_FAILURE';

export const FETCH_KEY_PAIR_REQUEST = '@currentUser/FETCH_KEY_PAIR_REQUEST';
export const FETCH_KEY_PAIR_SUCCESS = '@currentUser/FETCH_KEY_PAIR_SUCCESS';
export const FETCH_KEY_PAIR_FAILURE = '@currentUser/FETCH_KEY_PAIR_FAILURE';

export const FETCH_USER_TEAMS_REQUEST = '@currentUser/FETCH_USER_TEAMS_REQUEST';
export const FETCH_USER_TEAMS_SUCCESS = '@currentUser/FETCH_USER_TEAMS_SUCCESS';
export const FETCH_USER_TEAMS_FAILURE = '@currentUser/FETCH_USER_TEAMS_FAILURE';

export const SET_MASTER_PASSWORD = '@currentUser/SET_MASTER_PASSWORD';
export const SET_KEY_PAIR = '@currentUser/SET_KEY_PAIR';
export const SET_CURRENT_TEAM_ID = '@currentUser/SET_CURRENT_TEAM_ID';

export const SET_DEFAULT_LIST_ID = '@currentUser/SET_DEFAULT_LIST_ID';

export const LEAVE_TEAM_REQUEST = '@currentUser/LEAVE_TEAM_REQUEST';
export const LEAVE_TEAM_SUCCESS = '@currentUser/LEAVE_TEAM_SUCCESS';
export const LEAVE_TEAM_FAILURE = '@currentUser/LEAVE_TEAM_FAILURE';

export const ADD_TEAM_TO_TEAMS_LIST = '@currentUser/ADD_TEAM_TO_TEAMS_LIST';

export const LOGOUT = '@currentUser/LOGOUT';

export const RESET_CURRENT_USER_STATE = '@currentUser/RESET_CURRENT_USER_STATE';

export const LAST_UPDATED_ITEMS_UNIXTIME = '@user/LAST_UPDATED_ITEMS_UNIXTIME';

export const setLastUpdatedUnixtime = time => ({
  type: LAST_UPDATED_ITEMS_UNIXTIME,
  payload: {
    lastUpdated: time,
  },
});

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

export const setDefaultListId = listId => ({
  type: SET_DEFAULT_LIST_ID,
  payload: {
    listId,
  },
});

export const addTeamToTeamsList = teamId => ({
  type: ADD_TEAM_TO_TEAMS_LIST,
  payload: {
    teamId,
  },
});

export const logout = () => ({
  type: LOGOUT,
});

export const resetCurrentUserState = () => ({
  type: RESET_CURRENT_USER_STATE,
});
