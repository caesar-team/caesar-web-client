// eslint-disable-next-line
self.window = self;

const { decryptItem, getPrivateKeyObj } = require('./utils/cipherUtils');

window.onmessage = async message => {
  const {
    data: {
      event,
      data: { listId, items, privateKey, masterPassword },
    },
  } = message;

  switch (event) {
    case `decryptItems_${listId}`: {
      const privateKeyObj = await getPrivateKeyObj(privateKey, masterPassword);

      for (let index = 0; index < items.length; index++) {
        const item = items[index];
        // eslint-disable-next-line
        try {
          const secret = await decryptItem(item.secret, privateKeyObj);

          window.postMessage({
            event: `emitDecryptedItem_${listId}`,
            item: {
              ...item,
              secret,
            },
          });
        } catch (e) {
          console.log(e, item, listId);
        }
      }
      break;
    }
    default:
      break;
  }
};
