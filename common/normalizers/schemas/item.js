import { schema } from 'normalizr';

// TODO: change it to childItems on BE side
// TODO: replace CHILD_ITEMS_KEY to childItems or children by place
const CHILD_ITEMS_KEY = 'invited';

const itemSchema = new schema.Entity('itemsById', undefined, {
  processStrategy: (entity, parent) => {
    const { [CHILD_ITEMS_KEY]: children, ...rest } = entity;

    return {
      ...entity,
      listId: parent.id,
    };
  },
});

export default itemSchema;
