import { schema } from 'normalizr';
import itemSchema from './item';

const listSchema = new schema.Entity('listsById', {
  children: [itemSchema],
});

export default listSchema;
