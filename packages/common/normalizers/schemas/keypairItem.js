import { schema } from 'normalizr';
import { ITEM_TYPE } from '@caesar/common/constants';
import { generateSystemItemName } from '../../utils/item';

const itemSchema = new schema.Entity(
  'keyPairItemById',
  {},
  {
    processStrategy: ({
      privateKey,
      publicKey,
      teamId,
      name,
      id,
      password,
    }) => ({
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
        name: name || generateSystemItemName(ITEM_TYPE.KEYPAIR, teamId || id),
      },
    }),
  },
);

export default itemSchema;
