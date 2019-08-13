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
} from 'common/actions/member';

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
      byId: payload.membersById,
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
});
