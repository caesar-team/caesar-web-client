import { arrayToObject } from '../../utils/utils';

export const ADD_KEYPAIRS_BATCH = '@keypair/ADD_KEYPAIRS_BATCH';
export const REMOVE_KEYPAIR = '@keypair/REMOVE_KEYPAIR';

export const addKeyPairsBatch = items => {
  let itemsById = items;

  if (Array.isArray(items)) {
    itemsById = arrayToObject(items);
  }

  return {
    type: ADD_KEYPAIRS_BATCH,
    payload: {
      itemsById,
    },
  };
};

export const removeSystemItem = itemId => ({
  type: REMOVE_KEYPAIR,
  payload: {
    itemId,
  },
});
