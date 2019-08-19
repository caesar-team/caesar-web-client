import { createReducer } from 'common/utils/reducer';
import {
  INVITE_MEMBER_FAILURE,
  INVITE_MEMBER_REQUEST,
  INVITE_MEMBER_SUCCESS,
  REMOVE_INVITE_FAILURE,
  REMOVE_INVITE_REQUEST,
  REMOVE_INVITE_SUCCESS,
  REMOVE_SHARE_FAILURE,
  REMOVE_SHARE_REQUEST,
  REMOVE_SHARE_SUCCESS,
  SHARE_ITEM_BATCH_FAILURE,
  SHARE_ITEM_BATCH_REQUEST,
  SHARE_ITEM_BATCH_SUCCESS,
  SHARE_ITEM_FAILURE,
  SHARE_ITEM_REQUEST,
  SHARE_ITEM_SUCCESS,
  CHANGE_CHILD_ITEM_PERMISSION_REQUEST,
  CHANGE_CHILD_ITEM_PERMISSION_SUCCESS,
  CHANGE_CHILD_ITEM_PERMISSION_FAILURE,
  ADD_CHILD_ITEMS_BATCH,
  RESET_STORE,
} from 'common/actions/childItem';

import { PERMISSION_WRITE } from '../constants';

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
  [SHARE_ITEM_REQUEST](state) {
    return state;
  },
  [SHARE_ITEM_SUCCESS](state, { payload }) {
    return {
      ...state,
      itemsById: {
        ...state.itemsById,
        [payload.itemId]: {
          ...state.itemsById[payload.itemId],
          invited: [
            ...state.itemsById[payload.itemId].invited,
            ...payload.invited,
          ],
        },
      },
      workInProgressItem: state.workInProgressItem
        ? {
            ...state.workInProgressItem,
            invited: [...state.workInProgressItem.invited, ...payload.invited],
          }
        : null,
    };
  },
  [SHARE_ITEM_FAILURE](state) {
    return state;
  },
  [SHARE_ITEM_BATCH_REQUEST](state) {
    return state;
  },
  [SHARE_ITEM_BATCH_SUCCESS](state, { payload }) {
    return {
      ...state,
      itemsById: {
        ...state.itemsById,
        ...payload.invited.reduce(
          (accumulator, invite) => ({
            ...accumulator,
            [invite.itemId]: {
              ...state.itemsById[invite.itemId],
              invited: [
                ...state.itemsById[invite.itemId].invited,
                ...invite.invited,
              ],
            },
          }),
          {},
        ),
      },
    };
  },
  [SHARE_ITEM_BATCH_FAILURE](state) {
    return state;
  },
  [REMOVE_SHARE_REQUEST](state) {
    return state;
  },
  [REMOVE_SHARE_SUCCESS](state, { payload }) {
    return {
      ...state,
      itemsById: {
        ...state.itemsById,
        [payload.itemId]: {
          ...state.itemsById[payload.itemId],
          invited: state.itemsById[payload.itemId].invited.filter(
            invite => invite.id !== payload.shareId,
          ),
        },
      },
      workInProgressItem: {
        ...state.workInProgressItem,
        invited: state.workInProgressItem.invited.filter(
          invite => invite.id !== payload.shareId,
        ),
      },
    };
  },
  [REMOVE_SHARE_FAILURE](state) {
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
        [payload.childItemId]: {
          ...state.byId[payload.childItemId],
          access: payload.permission,
        },
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
  [RESET_STORE]() {
    return initialState;
  },
});
