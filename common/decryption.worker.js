// eslint-disable-next-line
self.window = self;

const { decryptItem, getPrivateKeyObj } = require('./utils/cipherUtils');
const constants = require('../common/constants');

const { API_URI, WORKER_DECRYPTION_BUFFER_SIZE } = constants;

const postMessage = (event, items) =>
  window.postMessage({ event, items }, API_URI);

window.onmessage = async message => {
  const {
    data: { event, data },
  } = message;

  const { events, items, privateKey, masterPassword } = data;

  const privateKeyObj = await getPrivateKeyObj(privateKey, masterPassword);
  const len = items.length;

  let buffer = [];

  if (event === events.eventToWorker) {
    for (let index = 0; index < len; index++) {
      const item = items[index];
      const isLast = index === len - 1;

      try {
        // eslint-disable-next-line
        const data = await decryptItem(item.secret, privateKeyObj);

        buffer.push({ id: item.id, data });

        if (buffer.length === WORKER_DECRYPTION_BUFFER_SIZE || isLast) {
          postMessage(events.eventFromWorker, buffer);

          buffer = [];
        }
      } catch (e) {
        console.log(e, item);
      }
    }
  }
};
