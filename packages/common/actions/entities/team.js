export const FETCH_TEAMS_REQUEST = '@team/FETCH_TEAMS_REQUEST';
export const FETCH_TEAMS_SUCCESS = '@team/FETCH_TEAMS_SUCCESS';
export const FETCH_TEAMS_FAILURE = '@team/FETCH_TEAMS_FAILURE';

export const FETCH_TEAM_REQUEST = '@team/FETCH_TEAM_REQUEST';
export const FETCH_TEAM_SUCCESS = '@team/FETCH_TEAM_SUCCESS';
export const FETCH_TEAM_FAILURE = '@team/FETCH_TEAM_FAILURE';

export const CREATE_TEAM_REQUEST = '@team/CREATE_TEAM_REQUEST';
export const CREATE_TEAM_SUCCESS = '@team/CREATE_TEAM_SUCCESS';
export const CREATE_TEAM_FAILURE = '@team/CREATE_TEAM_FAILURE';

export const CREATE_TEAM_KEYS_REQUEST = '@team/CREATE_TEAM_KEYS_REQUEST';
export const CREATE_TEAM_KEYS_SUCCESS = '@team/CREATE_TEAM_KEYS_SUCCESS';
export const CREATE_TEAM_KEYS_FAILURE = '@team/CREATE_TEAM_KEYS_FAILURE';

export const EDIT_TEAM_REQUEST = '@team/EDIT_TEAM_REQUEST';
export const EDIT_TEAM_SUCCESS = '@team/EDIT_TEAM_SUCCESS';
export const EDIT_TEAM_FAILURE = '@team/EDIT_TEAM_FAILURE';

export const REMOVE_TEAM_REQUEST = '@team/REMOVE_TEAM_REQUEST';
export const REMOVE_TEAM_SUCCESS = '@team/REMOVE_TEAM_SUCCESS';
export const REMOVE_TEAM_FAILURE = '@team/REMOVE_TEAM_FAILURE';

export const TOGGLE_PIN_TEAM_REQUEST = '@team/TOGGLE_PIN_TEAM_REQUEST';
export const TOGGLE_PIN_TEAM_SUCCESS = '@team/TOGGLE_PIN_TEAM_SUCCESS';
export const TOGGLE_PIN_TEAM_FAILURE = '@team/TOGGLE_PIN_TEAM_FAILURE';

export const ADD_TEAMS_BATCH = '@team/ADD_TEAMS_BATCH';
export const ADD_TEAM_MEMBERS_BATCH = '@team/ADD_TEAM_MEMBERS_BATCH';
export const REMOVE_MEMBER_FROM_TEAM = '@team/REMOVE_MEMBER_FROM_TEAM';

export const RESET_TEAM_STATE = '@team/RESET_TEAM_STATE';
export const LOCK_TEAM = '@team/LOCK_TEAM';

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

export const fetchTeamRequest = teamId => ({
  type: FETCH_TEAM_REQUEST,
  payload: {
    teamId,
  },
});

export const fetchTeamSuccess = team => ({
  type: FETCH_TEAM_SUCCESS,
  payload: {
    team,
  },
});

export const fetchTeamFailure = () => ({
  type: FETCH_TEAM_FAILURE,
});

export const createTeamRequest = (
  title,
  icon,
  handleCloseModal,
  setSubmitting,
  setErrors,
) => ({
  type: CREATE_TEAM_REQUEST,
  payload: {
    title,
    icon,
  },
  meta: {
    handleCloseModal,
    setSubmitting,
    setErrors,
  },
});

export const createTeamSuccess = team => ({
  type: CREATE_TEAM_SUCCESS,
  payload: {
    team,
  },
});

export const createTeamFailure = () => ({
  type: CREATE_TEAM_FAILURE,
});

export const createTeamKeysRequest = team => {
  return {
    type: CREATE_TEAM_KEYS_REQUEST,
    payload: {
      team,
    },
  };
};

export const createTeamKeysSuccess = teamSystemItem => ({
  type: CREATE_TEAM_KEYS_SUCCESS,
  payload: {
    item: teamSystemItem,
  },
});

export const createTeamKeysFailure = () => ({
  type: CREATE_TEAM_KEYS_FAILURE,
});

export const editTeamRequest = (
  teamId,
  title,
  icon,
  handleCloseModal,
  setSubmitting,
  setErrors,
) => ({
  type: EDIT_TEAM_REQUEST,
  payload: {
    teamId,
    title,
    icon,
  },
  meta: {
    handleCloseModal,
    setSubmitting,
    setErrors,
  },
});

export const editTeamSuccess = team => ({
  type: EDIT_TEAM_SUCCESS,
  payload: {
    team,
  },
});

export const editTeamFailure = () => ({
  type: EDIT_TEAM_FAILURE,
});

export const removeTeamRequest = teamId => ({
  type: REMOVE_TEAM_REQUEST,
  payload: {
    teamId,
  },
});

export const removeTeamSuccess = teamId => ({
  type: REMOVE_TEAM_SUCCESS,
  payload: {
    teamId,
  },
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

export const lockTeam = (teamId, lock) => ({
  type: LOCK_TEAM,
  payload: {
    teamId,
    lock,
  },
});

export const addMembersToTeamList = (teamId, membersById) => ({
  type: ADD_TEAM_MEMBERS_BATCH,
  payload: {
    teamId,
    membersById,
  },
});

export const removeMemberFromTeam = (teamId, memberId) => ({
  type: REMOVE_MEMBER_FROM_TEAM,
  payload: {
    teamId,
    memberId,
  },
});

export const resetTeamState = () => ({
  type: RESET_TEAM_STATE,
});

export const togglePinTeamRequest = (teamId, shouldPinned) => ({
  type: TOGGLE_PIN_TEAM_REQUEST,
  payload: {
    teamId,
    shouldPinned,
  },
});

export const togglePinTeamSuccess = (teamId, isPinned) => ({
  type: TOGGLE_PIN_TEAM_SUCCESS,
  payload: {
    teamId,
    isPinned,
  },
});

export const togglePinTeamFailure = () => ({
  type: TOGGLE_PIN_TEAM_FAILURE,
});
