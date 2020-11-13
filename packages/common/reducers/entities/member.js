import { omit } from 'lodash';
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
  ADD_TEAM_MEMBERS_BATCH_REQUEST,
  ADD_TEAM_MEMBERS_BATCH_SUCCESS,
  ADD_TEAM_MEMBERS_BATCH_FAILURE,
  UPDATE_TEAM_MEMBER_ROLE_REQUEST,
  UPDATE_TEAM_MEMBER_ROLE_SUCCESS,
  UPDATE_TEAM_MEMBER_ROLE_FAILURE,
  REMOVE_TEAM_MEMBER_REQUEST,
  REMOVE_TEAM_MEMBER_SUCCESS,
  REMOVE_TEAM_MEMBER_FAILURE,
  REMOVE_TEAM_MEMBERS_BATCH,
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
  [ADD_TEAM_MEMBERS_BATCH_REQUEST](state) {
    return state;
  },
  [ADD_TEAM_MEMBERS_BATCH_SUCCESS](state, { payload }) {
    const {
      members: membersById = {
        membersById: {},
      },
    } = payload;

    return {
      ...state,
      byId: {
        ...state.byId,
        ...membersById,
      },
    };
  },
  [ADD_TEAM_MEMBERS_BATCH_FAILURE](state) {
    return state;
  },
  [UPDATE_TEAM_MEMBER_ROLE_REQUEST](state) {
    return state;
  },
  [UPDATE_TEAM_MEMBER_ROLE_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.memberId]: {
          ...state.byId[payload.memberId],
          teamRole: payload.teamRole,
        },
      },
    };
  },
  [UPDATE_TEAM_MEMBER_ROLE_FAILURE](state) {
    return state;
  },
  [REMOVE_TEAM_MEMBER_REQUEST](state) {
    return state;
  },
  [REMOVE_TEAM_MEMBER_SUCCESS](state, { payload }) {
    const { [payload.memberId]: member, ...rest } = state.byId;

    return {
      ...state,
      byId: rest,
    };
  },
  [REMOVE_TEAM_MEMBER_FAILURE](state) {
    return state;
  },
  [REMOVE_TEAM_MEMBERS_BATCH](state, { payload }) {
    const byId = omit(state.byId, payload.memberIds);

    return {
      ...state,
      byId,
    };
  },
  [RESET_MEMBER_STATE]() {
    return initialState;
  },
});
