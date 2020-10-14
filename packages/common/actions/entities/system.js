import { arrayToObject } from '../../utils/utils';

export const ADD_SYSTEM_ITEMS_BATCH = '@system/ADD_SYSTEM_ITEMS_BATCH';
export const REMOVE_SYSTEM_ITEM = '@system/REMOVE_SYSTEM_ITEM';

export const RESET_SYSTEM_STATE = '@system/RESET_SYSTEM_STATE';

export const addSystemItemsBatch = items => {
  let itemsById = items;

  if (Array.isArray(items)) {
    itemsById = arrayToObject(items);
  }

  return {
    type: ADD_SYSTEM_ITEMS_BATCH,
    payload: {
      itemsById,
    },
  };
};

export const removeSystemItem = itemId => ({
  type: REMOVE_SYSTEM_ITEM,
  payload: {
    itemId,
  },
});

export const resetSystemState = () => ({
  type: RESET_SYSTEM_STATE,
});
