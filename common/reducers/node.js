import { createReducer } from 'common/utils/reducer';
import {
  FETCH_NODES_REQUEST,
  FETCH_NODES_SUCCESS,
  FETCH_NODES_FAILURE,
  ADD_ITEM,
  SET_WORK_IN_PROGRESS_ITEM,
  SET_WORK_IN_PROGRESS_LIST_ID,
  REMOVE_ITEM_REQUEST,
  REMOVE_ITEM_SUCCESS,
  REMOVE_ITEM_FAILURE,
  MOVE_ITEM_REQUEST,
  MOVE_ITEM_SUCCESS,
  MOVE_ITEM_FAILURE,
  CREATE_ITEM_REQUEST,
  CREATE_ITEM_SUCCESS,
  CREATE_ITEM_FAILURE,
  EDIT_ITEM_REQUEST,
  EDIT_ITEM_SUCCESS,
  EDIT_ITEM_FAILURE,
  ACCEPT_ITEM_UPDATE_REQUEST,
  ACCEPT_ITEM_UPDATE_SUCCESS,
  ACCEPT_ITEM_UPDATE_FAILURE,
  TOGGLE_ITEM_TO_FAVORITE_REQUEST,
  TOGGLE_ITEM_TO_FAVORITE_SUCCESS,
  TOGGLE_ITEM_TO_FAVORITE_FAILURE,
  CHANGE_ITEM_PERMISSION_REQUEST,
  CHANGE_ITEM_PERMISSION_SUCCESS,
  CHANGE_ITEM_PERMISSION_FAILURE,
  INVITE_MEMBER_REQUEST,
  INVITE_MEMBER_SUCCESS,
  INVITE_MEMBER_FAILURE,
  REMOVE_INVITE_REQUEST,
  REMOVE_INVITE_SUCCESS,
  REMOVE_INVITE_FAILURE,
  SHARE_ITEM_REQUEST,
  SHARE_ITEM_SUCCESS,
  SHARE_ITEM_FAILURE,
  REMOVE_SHARE_REQUEST,
  REMOVE_SHARE_SUCCESS,
  REMOVE_SHARE_FAILURE,
  CREATE_ANONYMOUS_LINK_REQUEST,
  CREATE_ANONYMOUS_LINK_SUCCESS,
  CREATE_ANONYMOUS_LINK_FAILURE,
  REMOVE_ANONYMOUS_LINK_REQUEST,
  REMOVE_ANONYMOUS_LINK_SUCCESS,
  REMOVE_ANONYMOUS_LINK_FAILURE,
  CREATE_LIST_REQUEST,
  CREATE_LIST_SUCCESS,
  CREATE_LIST_FAILURE,
  EDIT_LIST_REQUEST,
  EDIT_LIST_SUCCESS,
  EDIT_LIST_FAILURE,
  REMOVE_LIST_REQUEST,
  REMOVE_LIST_SUCCESS,
  REMOVE_LIST_FAILURE,
  SORT_LIST_REQUEST,
  SORT_LIST_SUCCESS,
  SORT_LIST_FAILURE,
} from 'common/actions/node';
import { PERMISSION_WRITE } from '../constants';

const initialState = {
  isLoading: true,
  isError: false,
  listsById: {},
  itemsById: {},
  workInProgressItem: null,
  workInProgressListId: null,
};

export default createReducer(initialState, {
  [FETCH_NODES_REQUEST](state) {
    return { ...state, isLoading: true };
  },
  [FETCH_NODES_SUCCESS](state, { payload }) {
    return {
      ...state,
      isLoading: false,
      isError: false,
      listsById: payload.listsById,
    };
  },
  [FETCH_NODES_FAILURE](state) {
    return { ...state, isLoading: false, isError: true };
  },
  [ADD_ITEM](state, { payload }) {
    return {
      ...state,
      itemsById: { ...state.itemsById, [payload.item.id]: payload.item },
    };
  },
  [SET_WORK_IN_PROGRESS_ITEM](state, { payload }) {
    return {
      ...state,
      workInProgressItem: payload.item
        ? {
            ...payload.item,
            mode: payload.mode,
          }
        : null,
    };
  },
  [SET_WORK_IN_PROGRESS_LIST_ID](state, { payload }) {
    return {
      ...state,
      workInProgressListId: payload.listId,
    };
  },
  [REMOVE_ITEM_REQUEST](state) {
    return state;
  },
  [REMOVE_ITEM_SUCCESS](state, { payload }) {
    const { [payload.itemId]: item, ...rest } = state.itemsById;

    return {
      ...state,
      workInProgressItem: null,
      itemsById: rest,
      listsById: {
        ...state.listsById,
        [payload.listId]: {
          ...state.listsById[payload.listId],
          children: state.listsById[payload.listId].children.filter(
            ({ id }) => id !== payload.itemId,
          ),
        },
      },
    };
  },
  [REMOVE_ITEM_FAILURE](state) {
    return state;
  },
  [MOVE_ITEM_REQUEST](state) {
    return state;
  },
  [MOVE_ITEM_SUCCESS](state, { payload }) {
    return {
      ...state,
      itemsById: {
        ...state.itemsById,
        [payload.itemId]: {
          ...state.itemsById[payload.itemId],
          listId: payload.newListId,
        },
      },
      listsById: {
        ...state.listsById,
        [payload.newListId]: {
          ...state.listsById[payload.newListId],
          children: [
            ...state.listsById[payload.newListId].children,
            { id: payload.itemId },
          ],
        },
        [payload.oldListId]: {
          ...state.listsById[payload.oldListId],
          children: state.listsById[payload.oldListId].children.filter(
            ({ id }) => id !== payload.itemId,
          ),
        },
      },
    };
  },
  [MOVE_ITEM_FAILURE](state) {
    return state;
  },
  [CREATE_ITEM_REQUEST](state) {
    return state;
  },
  [CREATE_ITEM_SUCCESS](state, { payload }) {
    return {
      ...state,
      itemsById: {
        ...state.itemsById,
        [payload.item.id]: payload.item,
      },
      listsById: {
        ...state.listsById,
        [payload.item.listId]: {
          ...state.listsById[payload.item.listId],
          children: [
            ...state.listsById[payload.item.listId].children,
            { id: payload.item.id },
          ],
        },
      },
    };
  },
  [CREATE_ITEM_FAILURE](state) {
    return state;
  },
  [EDIT_ITEM_REQUEST](state) {
    return state;
  },
  [EDIT_ITEM_SUCCESS](state, { payload }) {
    return {
      ...state,
      itemsById: {
        ...state.itemsById,
        [payload.item.id]: payload.item,
      },
    };
  },
  [EDIT_ITEM_FAILURE](state) {
    return state;
  },
  [ACCEPT_ITEM_UPDATE_REQUEST](state) {
    return state;
  },
  [ACCEPT_ITEM_UPDATE_SUCCESS](state, { payload }) {
    return {
      ...state,
      itemsById: {
        ...state.itemsById,
        [payload.item.id]: payload.item,
      },
    };
  },
  [ACCEPT_ITEM_UPDATE_FAILURE](state) {
    return state;
  },
  [TOGGLE_ITEM_TO_FAVORITE_REQUEST](state) {
    return state;
  },
  [TOGGLE_ITEM_TO_FAVORITE_SUCCESS](state, { payload }) {
    return {
      ...state,
      workInProgressItem: {
        ...state.workInProgressItem,
        favorite: payload.isFavorite,
      },
      itemsById: {
        ...state.itemsById,
        [payload.itemId]: {
          ...state.itemsById[payload.itemId],
          favorite: payload.isFavorite,
        },
      },
      listsById: {
        ...state.listsById,
        [payload.favoritesListId]: {
          ...state.listsById[payload.favoritesListId],
          children: payload.isFavorite
            ? [
                ...state.listsById[payload.favoritesListId].children,
                { id: payload.itemId },
              ]
            : state.listsById[payload.favoritesListId].children.filter(
                child => child.id !== payload.itemId,
              ),
        },
      },
    };
  },
  [TOGGLE_ITEM_TO_FAVORITE_FAILURE](state) {
    return state;
  },
  [CHANGE_ITEM_PERMISSION_REQUEST](state) {
    return state;
  },
  [CHANGE_ITEM_PERMISSION_SUCCESS](state, { payload }) {
    return {
      ...state,
      itemsById: {
        ...state.itemsById,
        [payload.itemId]: {
          ...state.itemsById[payload.itemId],
          invited: state.itemsById[payload.itemId].invited.map(invite =>
            invite.userId === payload.userId
              ? { ...invite, access: payload.permission }
              : invite,
          ),
        },
      },
      workInProgressItem: {
        ...state.workInProgressItem,
        invited: state.workInProgressItem.invited.map(invite =>
          invite.userId === payload.userId
            ? { ...invite, access: payload.permission }
            : invite,
        ),
      },
    };
  },
  [CHANGE_ITEM_PERMISSION_FAILURE](state) {
    return state;
  },
  [INVITE_MEMBER_REQUEST](state) {
    return state;
  },
  [INVITE_MEMBER_SUCCESS](state, { payload }) {
    return {
      ...state,
      itemsById: {
        ...state.itemsById,
        [payload.itemId]: {
          ...state.itemsById[payload.itemId],
          invited: [
            ...state.itemsById[payload.itemId].invited,
            {
              ...payload.member,
              id: payload.childItemId,
              userId: payload.member.id,
              access: PERMISSION_WRITE,
            },
          ],
        },
      },
      workInProgressItem: {
        ...state.workInProgressItem,
        invited: [
          ...state.workInProgressItem.invited,
          {
            ...payload.member,
            id: payload.childItemId,
            userId: payload.member.id,
            access: PERMISSION_WRITE,
          },
        ],
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
    return {
      ...state,
      itemsById: {
        ...state.itemsById,
        [payload.itemId]: {
          ...state.itemsById[payload.itemId],
          invited: state.itemsById[payload.itemId].invited.filter(
            invite => invite.userId !== payload.userId,
          ),
        },
      },
      workInProgressItem: {
        ...state.workInProgressItem,
        invited: state.workInProgressItem.invited.filter(
          invite => invite.userId !== payload.userId,
        ),
      },
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
      workInProgressItem: {
        ...state.workInProgressItem,
        invited: [...state.workInProgressItem.invited, ...payload.invited],
      },
    };
  },
  [SHARE_ITEM_FAILURE](state) {
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
  [CREATE_ANONYMOUS_LINK_REQUEST](state) {
    return state;
  },
  [CREATE_ANONYMOUS_LINK_SUCCESS](state, { payload }) {
    return {
      ...state,
      itemsById: {
        ...state.itemsById,
        [payload.itemId]: {
          ...state.itemsById[payload.itemId],
          shared: [payload.share],
        },
      },
      workInProgressItem: {
        ...state.workInProgressItem,
        shared: [payload.share],
      },
    };
  },
  [CREATE_ANONYMOUS_LINK_FAILURE](state) {
    return state;
  },
  [REMOVE_ANONYMOUS_LINK_REQUEST](state) {
    return state;
  },
  [REMOVE_ANONYMOUS_LINK_SUCCESS](state, { payload }) {
    return {
      ...state,
      itemsById: {
        ...state.itemsById,
        [payload.itemId]: {
          ...state.itemsById[payload.itemId],
          shared: [],
        },
      },
      workInProgressItem: {
        ...state.workInProgressItem,
        shared: [],
      },
    };
  },
  [REMOVE_ANONYMOUS_LINK_FAILURE](state) {
    return state;
  },
  [CREATE_LIST_REQUEST](state) {
    return state;
  },
  [CREATE_LIST_SUCCESS](state, { payload }) {
    return {
      ...state,
      listsById: {
        ...state.listsById,
        [payload.listId]: payload.list,
      },
    };
  },
  [CREATE_LIST_FAILURE](state) {
    return state;
  },
  [EDIT_LIST_REQUEST](state) {
    return state;
  },
  [EDIT_LIST_SUCCESS](state, { payload }) {
    return {
      ...state,
      listsById: {
        ...state.listsById,
        [payload.list.id]: payload.list,
      },
    };
  },
  [EDIT_LIST_FAILURE](state) {
    return state;
  },
  [REMOVE_LIST_REQUEST](state) {
    return state;
  },
  [REMOVE_LIST_SUCCESS](state, { payload }) {
    const { [payload.listId]: item, ...rest } = state.listsById;

    return {
      ...state,
      listsById: rest,
    };
  },
  [REMOVE_LIST_FAILURE](state) {
    return state;
  },
  [SORT_LIST_REQUEST](state) {
    return state;
  },
  [SORT_LIST_SUCCESS](state, { payload }) {
    return {
      ...state,
      listsById: {
        ...state.listsById,
        ...payload.resortedListsById,
      },
    };
  },
  [SORT_LIST_FAILURE](state) {
    return state;
  },
});
