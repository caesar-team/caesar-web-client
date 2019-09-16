import { createReducer } from 'common/utils/reducer';
import {
  INVITE_MEMBER_FAILURE,
  INVITE_MEMBER_REQUEST,
  INVITE_MEMBER_SUCCESS,
  REMOVE_INVITE_FAILURE,
  REMOVE_INVITE_REQUEST,
  REMOVE_INVITE_SUCCESS,
  CREATE_CHILD_ITEM_BATCH_REQUEST,
  CREATE_CHILD_ITEM_BATCH_SUCCESS,
  CREATE_CHILD_ITEM_BATCH_FAILURE,
  CHANGE_CHILD_ITEM_PERMISSION_REQUEST,
  CHANGE_CHILD_ITEM_PERMISSION_SUCCESS,
  CHANGE_CHILD_ITEM_PERMISSION_FAILURE,
  ADD_CHILD_ITEMS_BATCH,
  REMOVE_CHILD_ITEMS_BATCH,
  RESET_STORE,
} from 'common/actions/entities/childItem';
import { PERMISSION_WRITE } from 'common/constants';

const initialState = {
  isLoading: true,
  isError: false,
  byId: {},
};

export default createReducer(initialState, {
  [INVITE_MEMBER_REQUEST](state) {
    return state;
  },
  [INVITE_MEMBER_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.childItemId]: {
          ...state.byId[payload.childItemId],
          ...payload.member,
          originalItemId: payload.itemId,
          id: payload.childItemId,
          userId: payload.member.id,
          access: PERMISSION_WRITE,
        },
      },
    };
  },
  [INVITE_MEMBER_FAILURE](state) {
    return state;
  },
  [REMOVE_INVITE_REQUEST](state) {
    return state;
  },
  [REMOVE_INVITE_SUCCESS](state, { payload }) {
    const { [payload.childItemId]: childItem, ...rest } = state.byId;

    return {
      ...state,
      byId: rest,
    };
  },
  [REMOVE_INVITE_FAILURE](state) {
    return state;
  },
  [CREATE_CHILD_ITEM_BATCH_REQUEST](state) {
    return state;
  },
  [CREATE_CHILD_ITEM_BATCH_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        ...payload.childItemsById,
      },
    };
  },
  [CREATE_CHILD_ITEM_BATCH_FAILURE](state) {
    return state;
  },
  [CHANGE_CHILD_ITEM_PERMISSION_REQUEST](state) {
    return state;
  },
  [CHANGE_CHILD_ITEM_PERMISSION_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        ...payload.childItemsById,
      },
    };
  },
  [CHANGE_CHILD_ITEM_PERMISSION_FAILURE](state) {
    return state;
  },
  [ADD_CHILD_ITEMS_BATCH](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        ...payload.childItemsById,
      },
    };
  },
  [REMOVE_CHILD_ITEMS_BATCH](state, { payload }) {
    return {
      ...state,
      byId: Object.keys(state.byId).reduce(
        (accumulator, itemId) =>
          payload.childItemIds.includes(itemId)
            ? accumulator
            : { ...accumulator, [itemId]: state.byId[itemId] },
        {},
      ),
    };
  },
  [RESET_STORE]() {
    return initialState;
  },
});
