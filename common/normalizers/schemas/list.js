import { schema } from 'normalizr';

const listSchema = new schema.Entity('listsById', undefined, {
  processStrategy: (entity, parent) => ({
    ...entity,
    parentId: parent.id || null,
  }),
});

export default listSchema;
