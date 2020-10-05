export const ADD_TEAM_KEY_PAIR = '@keystore/ADD_TEAM_KEY_PAIR';
export const ADD_TEAM_KEY_PAIR_BATCH = '@keystore/ADD_TEAM_KEY_PAIR_BATCH';
export const REMOVE_TEAM_KEY_PAIR = '@keystore/REMOVE_TEAM_KEY_PAIR';
export const ADD_SHARE_KEY_PAIR = '@keystore/ADD_SHARE_KEY_PAIR';
export const ADD_SHARE_KEY_PAIR_BATCH = '@keystore/ADD_SHARE_KEY_PAIR_BATCH';
export const REMOVE_SHARE_KEY_PAIR = '@keystore/REMOVE_SHARE_KEY_PAIR';
export const ADD_PERSONAL_KEY_PAIR = '@keystore/ADD_PERSONAL_KEY_PAIR';
export const REMOVE_PERSONAL_KEY_PAIR = '@keystore/REMOVE_PERSONAL_KEY_PAIR';
export const ADD_ANONYMOUS_KEY_PAIR = '@keystore/ADD_ANONYMOUS_KEY_PAIR';
export const REMOVE_ANONYMOUS_KEY_PAIR = '@keystore/REMOVE_ANONYMOUS_KEY_PAIR';

export const addPersonalKeyPair = data => ({
  type: ADD_PERSONAL_KEY_PAIR,
  payload: {
    data,
  },
});

export const addTeamKeyPair = data => ({
  type: ADD_TEAM_KEY_PAIR,
  payload: {
    data,
  },
});

export const addTeamKeyPairBatch = data => ({
  type: ADD_TEAM_KEY_PAIR_BATCH,
  payload: {
    data,
  },
});

export const addShareKeyPair = data => ({
  type: ADD_SHARE_KEY_PAIR,
  payload: {
    data,
  },
});

export const addShareKeyPairBatch = data => ({
  type: ADD_SHARE_KEY_PAIR_BATCH,
  payload: {
    data,
  },
});

export const addAnonymousKeyPair = data => ({
  type: ADD_ANONYMOUS_KEY_PAIR,
  payload: {
    data,
  },
});

export const removePersonalKeyPair = () => ({
  type: REMOVE_PERSONAL_KEY_PAIR,
});

export const removeTeamKeyPair = teamId => ({
  type: REMOVE_TEAM_KEY_PAIR,
  payload: {
    teamId,
  },
});

export const removeShareKeyPair = itemId => ({
  type: REMOVE_SHARE_KEY_PAIR,
  payload: {
    itemId,
  },
});

export const removeAnonymousKeyPair = keyId => ({
  type: REMOVE_ANONYMOUS_KEY_PAIR,
  payload: {
    keyId,
  },
});
