import { schema } from 'normalizr';

const invitedUserSchema = new schema.Entity(
  'byId',
  {},
  {
    idAttribute: 'userId',
  },
);

export default invitedUserSchema;
