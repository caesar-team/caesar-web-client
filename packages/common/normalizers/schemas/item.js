import { schema } from 'normalizr';
import { ENTITY_TYPE } from '@caesar/common/constants';
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
      teamId: parent.teamId,
      __type: ENTITY_TYPE.ITEM,
    }),
  },
);

export default itemSchema;
