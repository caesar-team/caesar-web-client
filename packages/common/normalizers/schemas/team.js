/* eslint-disable camelcase */
import { schema } from 'normalizr';
import { ENTITY_TYPE, PERMISSION_ENTITY } from '@caesar/common/constants';
import { createPermissionsFromLinks } from '@caesar/common/utils/createPermissionsFromLinks';

const teamSchema = new schema.Entity('byId', undefined, {
  processStrategy: entity => ({
    ...entity,
    __type: ENTITY_TYPE.TEAM,
    _permissions: {
      ...createPermissionsFromLinks(entity._links),
      __typename: PERMISSION_ENTITY.TEAM,
    },
    users:
      entity.users?.map(user => ({
        ...user,
        _permissions: {
          ...createPermissionsFromLinks(user._links),
          __typename: PERMISSION_ENTITY.TEAM_MEMBER,
        },
      })) || [],
  }),
});

export default teamSchema;
