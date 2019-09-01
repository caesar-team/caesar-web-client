export const FETCH_TEAMS_REQUEST = '@team/FETCH_TEAMS_REQUEST';
export const FETCH_TEAMS_SUCCESS = '@team/FETCH_TEAMS_SUCCESS';
export const FETCH_TEAMS_FAILURE = '@team/FETCH_TEAMS_FAILURE';

export const CREATE_TEAM_REQUEST = '@team/CREATE_TEAM_REQUEST';
export const CREATE_TEAM_SUCCESS = '@team/CREATE_TEAM_SUCCESS';
export const CREATE_TEAM_FAILURE = '@team/CREATE_TEAM_FAILURE';

export const REMOVE_TEAM_REQUEST = '@team/REMOVE_TEAM_REQUEST';
export const REMOVE_TEAM_SUCCESS = '@team/REMOVE_TEAM_SUCCESS';
export const REMOVE_TEAM_FAILURE = '@team/REMOVE_TEAM_FAILURE';

export const ADD_TEAMS_BATCH = '@team/ADD_TEAMS_BATCH';

export const fetchTeamsRequest = () => ({
  type: FETCH_TEAMS_REQUEST,
});

export const fetchTeamsSuccess = teamsById => ({
  type: FETCH_TEAMS_SUCCESS,
  payload: {
    teamsById,
  },
});

export const fetchTeamsFailure = () => ({
  type: FETCH_TEAMS_FAILURE,
});

export const createTeamRequest = () => ({
  type: CREATE_TEAM_REQUEST,
});

export const createTeamSuccess = () => ({
  type: CREATE_TEAM_SUCCESS,
});

export const createTeamFailure = () => ({
  type: CREATE_TEAM_FAILURE,
});

export const removeTeamRequest = () => ({
  type: REMOVE_TEAM_REQUEST,
});

export const removeTeamSuccess = () => ({
  type: REMOVE_TEAM_SUCCESS,
});

export const removeTeamFailure = () => ({
  type: REMOVE_TEAM_FAILURE,
});

export const addTeamsBatch = teamsById => ({
  type: ADD_TEAMS_BATCH,
  payload: {
    teamsById,
  },
});
