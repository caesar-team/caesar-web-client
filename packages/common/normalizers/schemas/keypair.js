/* eslint-disable camelcase */
import { schema } from 'normalizr';
import { ENTITY_TYPE } from '@caesar/common/constants';

const keypairSchema = new schema.Entity('byId', undefined, {
  idAttribute: 'teamId',
  processStrategy: ({
    id,
    teamId,
    data: {
      pass = null,
      raws: { publicKey, privateKey } = {
        publicKey: null,
        privateKey: null,
      },
    } = {
      pass: null,
      raws: {
        publicKey: null,
        privateKey: null,
      },
    },
  }) => ({
    id,
    teamId,
    password: pass,
    publicKey,
    privateKey,
    __type: ENTITY_TYPE.KEYPAIR,
  }),
});

export default keypairSchema;
