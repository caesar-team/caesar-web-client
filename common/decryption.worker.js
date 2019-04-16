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

      items.forEach(async item => {
        window.postMessage({
          event: 'emitDecryptedItem',
          item: {
            ...item,
            secret: await decryptItem(item.secret, privateKeyObj),
          },
        });
      });
      break;
    }
    default:
      break;
  }
};
