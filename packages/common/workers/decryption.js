import { expose } from 'threads/worker';
import {
  decryptItem,
  getPrivateKeyObj,
} from '@caesar/common/utils/cipherUtils';

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
    const data = await decryptItem(item, state.privateKeyObject);

    return { id: item.id, data };
  },
  async decryptAll(items) {
    // eslint-disable-next-line no-return-await
    return await Promise.all(
      items.map(async item => {
        const { data: encryptedData } = JSON.parse(item.secret);
        const data = await decryptItem(encryptedData, state.privateKeyObject);

        return { id: item.id, data };
      }),
    );
  },
  async decryptRaws(raws) {
    if (!raws) return {};
    const result = await decryptItem(raws, state.privateKeyObject);
    console.log('decryptRaws');
    return result;
  },
};

expose(decryption);
