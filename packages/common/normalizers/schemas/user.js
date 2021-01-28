import { schema } from 'normalizr';

const userSchema = new schema.Entity(
  'usersById',
  {},
  {
    processStrategy: entity => entity,
  },
);

export default userSchema;
