import { expose } from 'threads/worker';
import { decryptItem, getPrivateKeyObj } from 'common/utils/cipherUtils';

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
    const data = await decryptItem(item.secret, state.privateKeyObject);
    return { id: item.id, data };
  },
  async decryptAll(items) {
    return await Promise.all(
      items.map(async item => {
        const data = await decryptItem(item.secret, state.privateKeyObject);
        return { id: item.id, data };
      }),
    );
  },
};

expose(decryption);
