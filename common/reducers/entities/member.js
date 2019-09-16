import { createReducer } from 'common/utils/reducer';
import {
  FETCH_MEMBERS_REQUEST,
  FETCH_MEMBERS_SUCCESS,
  FETCH_MEMBERS_FAILURE,
  CREATE_MEMBER_REQUEST,
  CREATE_MEMBER_SUCCESS,
  CREATE_MEMBER_FAILURE,
  CREATE_MEMBER_BATCH_REQUEST,
  CREATE_MEMBER_BATCH_SUCCESS,
  CREATE_MEMBER_BATCH_FAILURE,
  FETCH_TEAM_MEMBERS_REQUEST,
  FETCH_TEAM_MEMBERS_SUCCESS,
  FETCH_TEAM_MEMBERS_FAILURE,
  ADD_MEMBERS_BATCH,
  ADD_TEAM_TO_MEMBER,
  REMOVE_TEAM_FROM_MEMBER,
  REMOVE_TEAM_FROM_MEMBERS_BATCH,
  ADD_TEAM_TO_MEMBERS_BATCH,
} from 'common/actions/entities/member';

const initialState = {
  isLoading: false,
  isError: false,
  byId: {},
};

export default createReducer(initialState, {
  [FETCH_MEMBERS_REQUEST](state) {
    return { ...state, isLoading: true };
  },
  [FETCH_MEMBERS_SUCCESS](state, { payload }) {
    return {
      ...state,
      isLoading: false,
      isError: false,
      byId: {
        ...state.byId,
        ...payload.membersById,
      },
    };
  },
  [FETCH_MEMBERS_FAILURE](state) {
    return { ...state, isLoading: false, isError: true };
  },
  [CREATE_MEMBER_REQUEST](state) {
    return state;
  },
  [CREATE_MEMBER_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.member.id]: payload.member,
      },
    };
  },
  [CREATE_MEMBER_FAILURE](state) {
    return state;
  },
  [CREATE_MEMBER_BATCH_REQUEST](state) {
    return state;
  },
  [CREATE_MEMBER_BATCH_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        ...payload.members.reduce(
          (accumulator, member) => ({ ...accumulator, [member.id]: member }),
          {},
        ),
      },
    };
  },
  [CREATE_MEMBER_BATCH_FAILURE](state) {
    return state;
  },
  [FETCH_TEAM_MEMBERS_REQUEST](state) {
    return state;
  },
  [FETCH_TEAM_MEMBERS_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        ...payload.membersById,
      },
    };
  },
  [FETCH_TEAM_MEMBERS_FAILURE](state) {
    return state;
  },
  [ADD_MEMBERS_BATCH](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        ...payload.membersById,
      },
    };
  },
  [ADD_TEAM_TO_MEMBER](state, { payload }) {
    console.log('state', state);
    console.log('payload', payload);
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.memberId]: {
          ...state.byId[payload.memberId],
          teamIds: [...state.byId[payload.memberId].teamIds, payload.teamId],
        },
      },
    };
  },
  [ADD_TEAM_TO_MEMBERS_BATCH](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        ...payload.memberIds.reduce(
          (accumulator, memberId) => ({
            ...accumulator,
            [memberId]: {
              ...state.byId[memberId],
              // TODO: this error because BE side doesn't return teamIds for searched user
              teamIds: [
                ...(state.byId[memberId].teamIds || []),
                payload.teamId,
              ],
            },
          }),
          {},
        ),
      },
    };
  },
  [REMOVE_TEAM_FROM_MEMBER](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.memberId]: {
          ...state.byId[payload.memberId],
          teamIds: state.byId[payload.memberId].teamIds.filter(
            teamId => teamId !== payload.teamId,
          ),
        },
      },
    };
  },
  [REMOVE_TEAM_FROM_MEMBERS_BATCH](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        ...payload.memberIds.reduce(
          (accumulator, memberId) => ({
            ...accumulator,
            [memberId]: {
              ...state.byId[memberId],
              teamIds: state.byId[memberId].teamIds.filter(
                teamId => teamId !== payload.teamId,
              ),
            },
          }),
          {},
        ),
      },
    };
  },
});
