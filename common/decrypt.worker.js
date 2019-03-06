// eslint-disable-next-line
self.window = self;

const tree = require('./utils/tree');
const { decryptItem, getPrivateKeyObj } = require('./utils/cipherUtils');
const { ITEM_CREDENTIALS_TYPE, ITEM_DOCUMENT_TYPE } = require('./constants');

window.onmessage = async message => {
  const {
    data: {
      event,
      data: { privateKey, password, list },
    },
  } = message;

  switch (event) {
    case 'toDecryptList': {
      const privateKeyObj = await getPrivateKeyObj(privateKey, password);

      tree.createTree({ id: 'root', children: list }).walk(async node => {
        if (
          [ITEM_CREDENTIALS_TYPE, ITEM_DOCUMENT_TYPE].includes(node.model.type)
        ) {
          const decryptedSecret = await decryptItem(
            node.model.secret,
            privateKeyObj,
          );

          window.postMessage({
            event: 'fromDecryptList',
            data: {
              node: {
                ...node,
                model: {
                  ...node.model,
                  secret: decryptedSecret,
                },
              },
            },
          });
        }
      });
      break;
    }
    default:
      break;
  }
};
