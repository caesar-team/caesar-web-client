import { createReducer } from '@caesar/common/utils/reducer';
import {
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
  REMOVE_TEAM_FROM_MEMBER,
  REMOVE_TEAM_FROM_MEMBERS_BATCH,
  LEAVE_TEAM_SUCCESS,
  LEAVE_TEAM_FAILURE,
  RESET_MEMBER_STATE,
} from '@caesar/common/actions/entities/member';

const initialState = {
  isLoading: false,
  isError: false,
  byId: {},
};

export default createReducer(initialState, {
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
    const updatedMembers = Object.keys(payload.membersById).reduce(
      (acc, memberId) => {
        const updated = {
          ...state.byId[memberId],
          ...payload.membersById[memberId],
          _links: {
            ...state.byId[memberId]?._links,
            ...payload.membersById[memberId]._links,
          },
          _permissions: {
            ...state.byId[memberId]?._permissions,
            ...payload.membersById[memberId]._permissions,
          },
        };

        return { ...acc, [memberId]: { ...updated } };
      },
      {},
    );

    return {
      ...state,
      byId: {
        ...state.byId,
        ...updatedMembers,
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
  [LEAVE_TEAM_SUCCESS](state) {
    return state;
  },
  [LEAVE_TEAM_FAILURE](state) {
    return { ...state, isError: true };
  },
  [RESET_MEMBER_STATE]() {
    return initialState;
  },
});
