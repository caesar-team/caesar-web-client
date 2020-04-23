import { schema } from 'normalizr';
import { LIST_ENTITY_TYPE } from 'common/constants';
import itemSchema from './item';

const listSchema = new schema.Entity(
  'listsById',
  {
    children: [itemSchema],
  },
  {
    processStrategy: entity => ({
      ...entity,
      __type: LIST_ENTITY_TYPE,
    }),
  },
);

export default listSchema;
