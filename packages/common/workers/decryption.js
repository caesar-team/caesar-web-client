import { expose } from 'threads/worker';
import { decryptItem, getPrivateKeyObj } from '../utils/cipherUtils';

import { decryptItemData } from '../utils/item';

// eslint-disable-next-line
self.window = self;

const state = {
  privateKeyObject: null,
};

const decryption = {
  async init(key, masterPassword) {
    state.privateKeyObject = await getPrivateKeyObj(key, masterPassword);
  },
  async decrypt(item) {
    const decryptedData = await decryptItemData(item, state.privateKeyObject);

    return {
      ...item,
      ...decryptedData,
    };
  },
  async decryptAll(items) {
    const { privateKeyObject } = state;

    // eslint-disable-next-line no-return-await
    const result = await Promise.all(
      items.map(async item => {
        const data = await decryptItemData(item, privateKeyObject);

        return {
          ...item,
          ...data,
        };
      }),
    );

    return result;
  },

  async decryptRaws(encryptedRaws) {
    if (!encryptedRaws) return {};
    const raws = await decryptItem(encryptedRaws, state.privateKeyObject);

    return raws;
  },
};

expose(decryption);
