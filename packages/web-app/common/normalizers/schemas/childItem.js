import { schema } from 'normalizr';
import { CHILD_ITEM_ENTITY_TYPE } from 'common/constants';

const childItemSchema = new schema.Entity('childItemsById', undefined, {
  processStrategy: (entity, parent) => ({
    ...entity,
    originalItemId: parent.id,
    teamId: parent.teamId,
    __type: CHILD_ITEM_ENTITY_TYPE,
  }),
});

export default childItemSchema;
