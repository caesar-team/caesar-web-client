import { schema } from 'normalizr';
import { ITEM_TYPE } from '@caesar/common/constants';
import { generateSystemItemName } from '../../utils/item';

const itemSchema = new schema.Entity(
  'itemsById',
  {},
  {
    processStrategy: ({ privateKey, publicKey, teamId, password }) => ({
      type: ITEM_TYPE.KEYPAIR,
      data: {
        attachments: [
          {
            id: 'publicKey',
            name: 'publicKey',
          },
          {
            id: 'privateKey',
            name: 'privateKey',
          },
        ],
        raws: {
          privateKey,
          publicKey,
        },
        password,
        name: generateSystemItemName(ITEM_TYPE.KEYPAIR, teamId),
      },
    }),
  },
);

export default itemSchema;
