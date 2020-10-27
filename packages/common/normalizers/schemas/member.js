import { schema } from 'normalizr';
import { ENTITY_TYPE, PERMISSION_ENTITY } from '../../constants';
import { createPermissionsFromLinks } from '../../utils/createPermissionsFromLinks';

const memberSchema = new schema.Entity(
  'membersById',
  {},
  {
    processStrategy: entity => ({
      teamId: entity.teamId,
      teamRole: entity.teamRole,
      __type: ENTITY_TYPE.MEMBER,
      _permissions: entity?._links
        ? {
            ...createPermissionsFromLinks(entity._links),
            __typename: PERMISSION_ENTITY.TEAM_MEMBER,
          }
        : {},
    }),
  },
);

export default memberSchema;
