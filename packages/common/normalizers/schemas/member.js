import { schema } from 'normalizr';
import { ENTITY_TYPE, PERMISSION_ENTITY } from '../../constants';
import { createPermissionsFromLinks } from '../../utils/createPermissionsFromLinks';
import userSchema from './user';

const memberSchema = new schema.Entity(
  'byId',
  {
    user: userSchema,
  },
  {
    idAttribute: 'userId',
    processStrategy: entity => ({
      ...entity.user,
      teamRole: entity.teamRole,
      __type: ENTITY_TYPE.MEMBER,
      _permissions: entity?._links
        ? {
            ...createPermissionsFromLinks(entity._links),
            __typename: PERMISSION_ENTITY.TEAM,
          }
        : {},
    }),
  },
);

export default memberSchema;
