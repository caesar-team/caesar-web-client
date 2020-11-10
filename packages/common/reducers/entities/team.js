import { createReducer } from '@caesar/common/utils/reducer';
import {
  FETCH_TEAMS_REQUEST,
  FETCH_TEAMS_SUCCESS,
  FETCH_TEAMS_FAILURE,
  FETCH_TEAM_REQUEST,
  FETCH_TEAM_SUCCESS,
  FETCH_TEAM_FAILURE,
  CREATE_TEAM_REQUEST,
  CREATE_TEAM_SUCCESS,
  CREATE_TEAM_FAILURE,
  EDIT_TEAM_REQUEST,
  EDIT_TEAM_SUCCESS,
  EDIT_TEAM_FAILURE,
  REMOVE_TEAM_REQUEST,
  REMOVE_TEAM_SUCCESS,
  REMOVE_TEAM_FAILURE,
  ADD_TEAMS_BATCH,
  ADD_TEAM_MEMBERS_BATCH,
  REMOVE_MEMBER_FROM_TEAM,
  CREATE_TEAM_KEYS_REQUEST,
  CREATE_TEAM_KEYS_SUCCESS,
  CREATE_TEAM_KEYS_FAILURE,
  TOGGLE_PIN_TEAM_SUCCESS,
  RESET_TEAM_STATE,
  LOCK_TEAM,
} from '@caesar/common/actions/entities/team';
import { KEY_TYPE } from '../../constants';

const initialState = {
  isLoading: true,
  isError: false,
  byId: {},
};

export default createReducer(initialState, {
  [LOCK_TEAM](state, { payload }) {
    if (!payload?.teamId || !payload?.lock) return state;

    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.teamId]: {
          ...(state.byId[payload.teamId] || {}),
          ...{
            locked: payload?.lock || false,
          },
        },
      },
    };
  },
  [FETCH_TEAMS_REQUEST](state) {
    return { ...state, isLoading: true };
  },
  [FETCH_TEAMS_SUCCESS](state, { payload }) {
    return {
      ...state,
      isLoading: false,
      isError: false,
      byId: payload.teamsById,
    };
  },
  [FETCH_TEAMS_FAILURE](state) {
    return { ...state, isLoading: false, isError: true };
  },
  [FETCH_TEAM_REQUEST](state) {
    return { ...state, isLoading: true };
  },
  [FETCH_TEAM_SUCCESS](state, { payload }) {
    return {
      ...state,
      isLoading: false,
      isError: false,
      byId: {
        ...state.byId,
        [payload.team.id]: {
          ...(state.byId[payload.team.id] || {}),
          ...payload.team,
        },
      },
    };
  },
  [FETCH_TEAM_FAILURE](state) {
    return {
      ...state,
      isLoading: false,
      isError: true,
    };
  },
  [CREATE_TEAM_KEYS_REQUEST](state) {
    return state;
  },
  [CREATE_TEAM_KEYS_SUCCESS](state, { payload }) {
    const { item } = payload;

    return {
      ...state,
      [KEY_TYPE.TEAMS]: {
        ...state[KEY_TYPE.TEAMS],
        [item.id]: {
          ...item,
        },
      },
    };
  },
  [CREATE_TEAM_KEYS_FAILURE](state) {
    return state;
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
  [EDIT_TEAM_REQUEST](state) {
    return state;
  },
  [EDIT_TEAM_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.team.id]: {
          ...state.byId[payload.team.id],
          ...payload.team,
        },
      },
    };
  },
  [EDIT_TEAM_FAILURE](state) {
    return state;
  },
  [REMOVE_TEAM_REQUEST](state) {
    return state;
  },
  [REMOVE_TEAM_SUCCESS](state, { payload }) {
    const { [payload.teamId]: team, ...rest } = state.byId;

    return {
      ...state,
      byId: rest,
    };
  },
  [REMOVE_TEAM_FAILURE](state) {
    return state;
  },
  [ADD_TEAMS_BATCH](state, { payload }) {
    console.log(ADD_TEAMS_BATCH, payload);
    return {
      ...state,
      byId: {
        ...state.byId,
        ...payload.teamsById,
      },
    };
  },
  [ADD_TEAM_MEMBERS_BATCH](state, { payload }) {
    const memberIds = Object.keys(payload.membersById);

    if (memberIds.length <= 0) return state;

    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.teamId]: {
          ...state.byId[payload.teamId],
          members: [...state.byId[payload.teamId].members, ...memberIds],
        },
      },
    };
  },
  [REMOVE_MEMBER_FROM_TEAM](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.teamId]: {
          ...state.byId[payload.teamId],
          members: state.byId[payload.teamId].members.filter(
            id => id !== payload.memberId,
          ),
        },
      },
    };
  },
  [RESET_TEAM_STATE]() {
    return initialState;
  },
  [TOGGLE_PIN_TEAM_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.teamId]: {
          ...state.byId[payload.teamId],
          pinned: payload.isPinned,
        },
      },
    };
  },
});
