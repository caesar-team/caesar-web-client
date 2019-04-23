export const FETCH_USER_SELF_REQUEST = '@user/FETCH_USER_SELF_REQUEST';
export const FETCH_USER_SELF_SUCCESS = '@user/FETCH_USER_SELF_SUCCESS';
export const FETCH_USER_SELF_FAILURE = '@user/FETCH_USER_SELF_FAILURE';

export const FETCH_KEY_PAIR_REQUEST = '@user/FETCH_KEY_PAIR_REQUEST';
export const FETCH_KEY_PAIR_SUCCESS = '@user/FETCH_KEY_PAIR_SUCCESS';
export const FETCH_KEY_PAIR_FAILURE = '@user/FETCH_KEY_PAIR_FAILURE';

export const SET_MASTER_PASSWORD = '@user/SET_MASTER_PASSWORD';

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

export const setMasterPassword = masterPassword => ({
  type: SET_MASTER_PASSWORD,
  payload: {
    masterPassword,
  },
});
