import { schema } from 'normalizr';
import { ENTITY_TYPE } from '@caesar/common/constants';

const teamSchema = new schema.Entity('byId', undefined, {
  processStrategy: entity => ({
    ...entity,
    __type: ENTITY_TYPE.TEAM,
  }),
});

export default teamSchema;
