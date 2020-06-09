import { schema } from 'normalizr';
import { ENTITY_TYPE } from '@caesar/common/constants';

const childItemSchema = new schema.Entity('childItemsById', undefined, {
  processStrategy: (entity, parent) => ({
    ...entity,
    originalItemId: parent.id,
    teamId: parent.teamId,
    __type: ENTITY_TYPE.CHILD_ITEM,
  }),
});

export default childItemSchema;
