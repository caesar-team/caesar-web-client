// eslint-disable-next-line
self.window = self;

const { decryptItem, getPrivateKeyObj } = require('./utils/cipherUtils');

window.onmessage = async message => {
  const {
    data: {
      event,
      data: { items, privateKey, masterPassword },
    },
  } = message;

  switch (event) {
    case 'decryptItems': {
      const privateKeyObj = await getPrivateKeyObj(privateKey, masterPassword);

      for (let index = 0; index < items.length; index++) {
        const item = items[index];
        // eslint-disable-next-line
        const secret = await decryptItem(item.secret, privateKeyObj);

        window.postMessage({
          event: 'emitDecryptedItem',
          item: {
            ...item,
            secret,
          },
        });
      }
      break;
    }
    default:
      break;
  }
};
