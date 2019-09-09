import { Subject, Observable } from 'threads/observable';
import { expose } from 'threads/worker';
import { decryptItem, getPrivateKeyObj } from 'common/utils/cipherUtils';

// eslint-disable-next-line
self.window = self;

const BUFFER_SIZE = 2;

const state = {
  subject: new Subject(),
  privateKeyObject: null,
  buffer: [],
};

const decryption1 = {
  async init(key, masterPassword) {
    state.privateKeyObject = await getPrivateKeyObj(key, masterPassword);
  },
  finish() {
    state.subject.complete();
    state.subject = new Subject();
  },
  async decrypt(item) {
    const data = await decryptItem(item.secret, state.privateKeyObject);
    state.subject.next(data);
  },
  async decryptAll(items) {
    const len = items.length;

    for (let index = 0; index < len; index++) {
      const item = items[index];
      const isLast = index === len - 1;

      // eslint-disable-next-line
      const data = await decryptItem(item.secret, state.privateKeyObject);

      state.buffer.push({ id: item.id, data });

      if (state.buffer.length === BUFFER_SIZE || isLast) {
        console.log('HERE');
        state.subject.next(state.buffer);
        state.buffer = [];
      }
    }
  },
  events() {
    return Observable.from(state.subject);
  },
};

expose(decryption1);
