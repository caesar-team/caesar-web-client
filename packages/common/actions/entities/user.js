export const FETCH_USERS_REQUEST = '@user/FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = '@user/FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = '@user/FETCH_USERS_FAILURE';

export const CREATE_USER_REQUEST = '@user/CREATE_USER_REQUEST';
export const CREATE_USER_SUCCESS = '@user/CREATE_USER_SUCCESS';
export const CREATE_USER_FAILURE = '@user/CREATE_USER_FAILURE';

export const RESET_USER_STATE = '@user/RESET_USER_STATE';

export const fetchUsersRequest = () => ({
  type: FETCH_USERS_REQUEST,
});

export const fetchUsersSuccess = usersById => ({
  type: FETCH_USERS_SUCCESS,
  payload: {
    usersById,
  },
});

export const fetchUsersFailure = () => ({
  type: FETCH_USERS_FAILURE,
});

export const createUserRequest = payload => ({
  type: CREATE_USER_REQUEST,
  payload,
});

export const createUserSuccess = user => ({
  type: CREATE_USER_SUCCESS,
  payload: {
    user,
  },
});

export const createUserFailure = () => ({
  type: CREATE_USER_FAILURE,
});

export const resetUserState = () => ({
  type: RESET_USER_STATE,
});
