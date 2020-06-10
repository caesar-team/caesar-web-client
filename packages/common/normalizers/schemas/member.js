import { schema } from 'normalizr';
import { ENTITY_TYPE } from '@caesar/common/constants';

const memberSchema = new schema.Entity('byId', undefined, {
  processStrategy: entity => ({
    ...entity,
    __type: ENTITY_TYPE.MEMBER,
  }),
});

export default memberSchema;
