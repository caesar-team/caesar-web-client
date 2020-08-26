export const ADD_PERSONAL_KEY_PAIR = '@keyStore/ADD_PERSONAL_KEY_PAIR';
export const REMOVE_PERSONAL_KEY_PAIR = '@keyStore/REMOVE_PERSONAL_KEY_PAIR';
export const ADD_ENTITY_KEY_PAIR = '@keyStore/ADD_ENTITY_KEY_PAIR';
export const REMOVE_ENTITY_KEY_PAIR = '@keyStore/REMOVE_ENTITY_KEY_PAIR';
export const ADD_ANONYMOUS_KEY_PAIR = '@keyStore/ADD_ANONYMOUS_KEY_PAIR';
export const REMOVE_ANONYMOUS_KEY_PAIR = '@keyStore/REMOVE_ANONYMOUS_KEY_PAIR';

export const addPersonalKeyPair = data => ({
  type: ADD_PERSONAL_KEY_PAIR,
  payload: {
    data,
  },
});

export const addEntityKeyPair = data => ({
  type: ADD_ENTITY_KEY_PAIR,
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

export const removeEntityKeyPair = entityId => ({
  type: REMOVE_ENTITY_KEY_PAIR,
  payload: {
    entityId,
  },
});

export const removeAnonymousKeyPair = keyId => ({
  type: REMOVE_ANONYMOUS_KEY_PAIR,
  payload: {
    keyId,
  },
});
