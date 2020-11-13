import { schema } from 'normalizr';
import { ENTITY_TYPE } from '@caesar/common/constants';

const userSchema = new schema.Entity(
  'usersById',
  {},
  {
    processStrategy: entity => ({
      ...entity,
      __type: ENTITY_TYPE.USER,
    }),
  },
);

export default userSchema;
