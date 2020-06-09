import { schema } from 'normalizr';
import { ENTITY_TYPE } from '@caesar/common/constants';
import itemSchema from './item';

const listSchema = new schema.Entity(
  'listsById',
  {
    children: [itemSchema],
  },
  {
    processStrategy: entity => ({
      ...entity,
      __type: ENTITY_TYPE.LIST,
    }),
  },
);

export default listSchema;
