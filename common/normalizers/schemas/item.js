import { schema } from 'normalizr';
import { ITEM_ENTITY_TYPE } from 'common/constants';
import childItemSchema from './childItem';

const itemSchema = new schema.Entity(
  'itemsById',
  {
    invited: [childItemSchema],
  },
  {
    processStrategy: (entity, parent) => ({
      ...entity,
      listId: parent.id,
      __type: ITEM_ENTITY_TYPE,
    }),
  },
);

export default itemSchema;
