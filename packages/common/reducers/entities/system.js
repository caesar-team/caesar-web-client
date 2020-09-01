import { createReducer } from '@caesar/common/utils/reducer';
import {
  ADD_SYSTEM_ITEMS_BATCH,
  REMOVE_SYSTEM_ITEM,
} from '@caesar/common/actions/entities/system';

const initialState = {};

export default createReducer(initialState, {
  [ADD_SYSTEM_ITEMS_BATCH](state, { payload }) {
    return {
      ...state,
      ...payload.items,
    };
  },
  [REMOVE_SYSTEM_ITEM](state, { payload }) {
    return {
      ...state,
      [payload.itemId]: undefined,
    };
  },
});
