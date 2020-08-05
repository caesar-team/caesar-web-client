export const ADD_TEAMS_KEY_PAIR = '@keyStore/ADD_TEAMS_KEY_PAIR';
export const REMOVE_TEAM_KEY_PAIR = '@keyStore/REMOVE_TEAM_KEY_PAIR';

export const addTeamsKeyPair = data => ({
  type: ADD_TEAMS_KEY_PAIR,
  payload: {
    data,
  },
});

export const removeTeamKeyPair = teamId => ({
  type: REMOVE_TEAM_KEY_PAIR,
  payload: {
    teamId,
  },
});
