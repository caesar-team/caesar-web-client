import { createReducer } from 'common/utils/reducer';
import {
  FETCH_TEAMS_REQUEST,
  FETCH_TEAMS_SUCCESS,
  FETCH_TEAMS_FAILURE,
  CREATE_TEAM_REQUEST,
  CREATE_TEAM_SUCCESS,
  CREATE_TEAM_FAILURE,
  REMOVE_TEAM_REQUEST,
  REMOVE_TEAM_SUCCESS,
  REMOVE_TEAM_FAILURE,
  ADD_TEAMS_BATCH,
} from 'common/actions/team';

const initialState = {
  isLoading: true,
  isError: false,
  byId: {},
};

export default createReducer(initialState, {
  [FETCH_TEAMS_REQUEST](state) {
    return { ...state, isLoading: true };
  },
  [FETCH_TEAMS_SUCCESS](state, { payload }) {
    return {
      ...state,
      isLoading: false,
      isError: false,
      byId: {
        ...state.byId,
        ...payload.teamsById,
      },
    };
  },
  [FETCH_TEAMS_FAILURE](state) {
    return { ...state, isLoading: false, isError: true };
  },
  [CREATE_TEAM_REQUEST](state) {
    return state;
  },
  [CREATE_TEAM_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.team.id]: payload.team,
      },
    };
  },
  [CREATE_TEAM_FAILURE](state) {
    return state;
  },
  [REMOVE_TEAM_REQUEST](state) {
    return state;
  },
  [REMOVE_TEAM_SUCCESS](state) {
    return state;
  },
  [REMOVE_TEAM_FAILURE](state) {
    return state;
  },
  [ADD_TEAMS_BATCH](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        ...payload.teamsById,
      },
    };
  },
});
