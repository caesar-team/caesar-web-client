import { createReducer } from '@caesar/common/utils/reducer';
import {
  ADD_SYSTEM_ITEMS_BATCH,
  REMOVE_SYSTEM_ITEM,
  RESET_SYSTEM_STATE,
} from '@caesar/common/actions/entities/system';

const initialState = {
  byId: {},
};

export default createReducer(initialState, {
  [ADD_SYSTEM_ITEMS_BATCH](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        ...payload.itemsById,
      },
    };
  },
  [REMOVE_SYSTEM_ITEM](state, { payload }) {
    const itemsById = state.byId;
    delete itemsById[payload.itemId];

    return {
      ...state,
      byId: {
        ...itemsById,
      },
    };
  },
  [RESET_SYSTEM_STATE]() {
    return initialState;
  },
});
