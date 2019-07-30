// eslint-disable-next-line
self.window = self;

const { decryptItem, getPrivateKeyObj } = require('./utils/cipherUtils');
const constants = require('../common/constants');

const { API_URI } = constants;

// TODO: move to env
const WORKER_DECRYPTION_BUFFER_SIZE = 10;

window.onmessage = async message => {
  const {
    data: {
      event,
      data: { id, items, privateKey, masterPassword },
    },
  } = message;

  let buffer = [];

  switch (event) {
    case `decryptItems_${id}`: {
      const privateKeyObj = await getPrivateKeyObj(privateKey, masterPassword);
      const len = items.length;

      for (let index = 0; index < len; index++) {
        const item = items[index];
        const isLast = index === len - 1;

        // eslint-disable-next-line
        try {
          const secret = await decryptItem(item.secret, privateKeyObj);

          buffer.push({
            ...item,
            secret,
          });

          if (buffer.length === WORKER_DECRYPTION_BUFFER_SIZE || isLast) {
            window.postMessage(
              {
                event: `emitDecryptedItems_${id}`,
                items: buffer,
              },
              API_URI,
            );

            buffer = [];
          }
        } catch (e) {
          console.log(e, item, id);
        }
      }
      break;
    }
    default:
      break;
  }
};
