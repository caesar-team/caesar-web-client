import { ITEM_CREDENTIALS_TYPE, ITEM_DOCUMENT_TYPE } from './constants';

// eslint-disable-next-line
self.window = self;

const openpgp = require('openpgp');
const tree = require('../common/utils/tree');

window.onmessage = async message => {
  const {
    data: { event, data },
  } = message;

  switch (event) {
    case 'toDecryptList': {
      const privateKeyObj = (await openpgp.key.readArmored(data.privateKey))
        .keys[0];
      await privateKeyObj.decrypt(data.password);

      tree
        .createTree({ id: 'root', children: data.list.model.children })
        .walk(node => {
          if (
            [ITEM_CREDENTIALS_TYPE, ITEM_DOCUMENT_TYPE].includes(
              node.model.type,
            )
          ) {
            openpgp.message.readArmored(node.model.secret).then(secret => {
              const options = {
                message: secret,
                privateKeys: [privateKeyObj],
              };

              openpgp.decrypt(options).then(plaintext => {
                window.postMessage({
                  event: 'fromDecryptList',
                  data: {
                    node: {
                      ...node,
                      model: {
                        ...node.model,
                        secret: JSON.parse(plaintext.data),
                      },
                    },
                  },
                });
              });
            });
          }
        });
      break;
    }
    default:
      break;
  }
};
