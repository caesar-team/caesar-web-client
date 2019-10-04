import { schema } from 'normalizr';
import { TEAM_ENTITY_TYPE } from 'common/constants';

const teamSchema = new schema.Entity('byId', undefined, {
  processStrategy: entity => ({
    ...entity,
    __type: TEAM_ENTITY_TYPE,
  }),
});

export default teamSchema;
