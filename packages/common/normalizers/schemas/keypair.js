/* eslint-disable camelcase */
import { schema } from 'normalizr';
import { ENTITY_TYPE, TEAM_TYPE } from '@caesar/common/constants';

const keypairSchema = (idAttribute = 'teamId') =>
  new schema.Entity('keyPairById', undefined, {
    idAttribute,
    processStrategy: ({
      id,
      teamId,
      data: {
        password = null,
        raws: { publicKey, privateKey } = {
          publicKey: null,
          privateKey: null,
        },
      } = {
        password: null,
        raws: {
          publicKey: null,
          privateKey: null,
        },
      },
    }) => ({
      id,
      teamId: teamId || TEAM_TYPE.PERSONAL,
      password,
      publicKey,
      privateKey,
      __type: ENTITY_TYPE.KEYPAIR,
    }),
  });

export default keypairSchema;
