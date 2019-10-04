import { schema } from 'normalizr';
import { MEMBER_ENTITY_TYPE } from 'common/constants';

const memberSchema = new schema.Entity('byId', undefined, {
  processStrategy: entity => ({
    ...entity,
    __type: MEMBER_ENTITY_TYPE,
  }),
});

export default memberSchema;
