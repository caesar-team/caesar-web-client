export const FETCH_USERS_REQUEST = '@user/FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = '@user/FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = '@user/FETCH_USERS_FAILURE';

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

export const resetUserState = () => ({
  type: RESET_USER_STATE,
});
