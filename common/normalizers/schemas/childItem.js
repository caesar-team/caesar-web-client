import { schema } from 'normalizr';

const childItemSchema = new schema.Entity('childItemsById', undefined, {
  processStrategy: (entity, parent) => ({
    ...entity,
    originalItemId: parent.id,
  }),
});

export default childItemSchema;
