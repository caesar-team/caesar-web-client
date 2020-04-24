import { createReducer } from '@caesar/common/utils/reducer';
import {
  FETCH_USER_SELF_REQUEST,
  FETCH_USER_SELF_SUCCESS,
  FETCH_USER_SELF_FAILURE,
  FETCH_KEY_PAIR_REQUEST,
  FETCH_KEY_PAIR_SUCCESS,
  FETCH_KEY_PAIR_FAILURE,
  FETCH_USER_TEAMS_REQUEST,
  FETCH_USER_TEAMS_SUCCESS,
  FETCH_USER_TEAMS_FAILURE,
  SET_MASTER_PASSWORD,
  SET_KEY_PAIR,
  SET_CURRENT_TEAM_ID,
  LEAVE_TEAM,
  JOIN_TEAM,
} from '@caesar/common/actions/user';

const initialState = {
  isLoading: false,
  isError: false,
  keyPair: null,
  masterPassword: null,
  teamIds: [],
  currentTeamId: null,
  data: null,
};

export default createReducer(initialState, {
  [FETCH_USER_SELF_REQUEST](state) {
    return { ...state, isLoading: true };
  },
  [FETCH_USER_SELF_SUCCESS](state, { payload }) {
    return { ...state, isLoading: false, isError: false, data: payload.data };
  },
  [FETCH_USER_SELF_FAILURE](state) {
    return { ...state, isLoading: false, isError: true };
  },
  [FETCH_KEY_PAIR_REQUEST](state) {
    return { ...state, isLoading: false, isError: true };
  },
  [FETCH_KEY_PAIR_SUCCESS](state, { payload }) {
    return {
      ...state,
      isLoading: false,
      isError: true,
      keyPair: payload.keyPair,
    };
  },
  [FETCH_KEY_PAIR_FAILURE](state) {
    return { ...state, isLoading: false, isError: true };
  },
  [FETCH_USER_TEAMS_REQUEST](state) {
    return state;
  },
  [FETCH_USER_TEAMS_SUCCESS](state, { payload }) {
    return {
      ...state,
      teamIds: payload.teamIds,
    };
  },
  [FETCH_USER_TEAMS_FAILURE](state) {
    return state;
  },
  [SET_MASTER_PASSWORD](state, { payload }) {
    return { ...state, masterPassword: payload.masterPassword };
  },
  [SET_KEY_PAIR](state, { payload }) {
    return { ...state, keyPair: payload.keyPair };
  },
  [SET_CURRENT_TEAM_ID](state, { payload }) {
    return { ...state, currentTeamId: payload.teamId };
  },
  [JOIN_TEAM](state, { payload }) {
    return { ...state, teamIds: [...state.teamIds, payload.teamId] };
  },
  [LEAVE_TEAM](state, { payload }) {
    return {
      ...state,
      teamIds: state.teamIds.filter(teamId => teamId !== payload.teamId),
    };
  },
});
