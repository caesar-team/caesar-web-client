import { schema } from 'normalizr';
import { PERMISSION_ENTITY } from '../../constants';
import { createPermissionsFromLinks } from '../../utils/createPermissionsFromLinks';

const memberSchema = new schema.Entity(
  'membersById',
  {},
  {
    processStrategy: entity => ({
      ...entity,
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
