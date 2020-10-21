import { schema } from 'normalizr';
import { ENTITY_TYPE, PERMISSION_ENTITY } from '@caesar/common/constants';
import { createPermissionsFromLinks } from '@caesar/common/utils/createPermissionsFromLinks';

const memberSchema = new schema.Entity('byId', undefined, {
  processStrategy: entity => ({
    ...entity,
    __type: ENTITY_TYPE.MEMBER,
    _permissions: {
      ...createPermissionsFromLinks(entity._links),
      __typename: PERMISSION_ENTITY.TEAM_MEMBER,
    },    
  }),
});

export default memberSchema;
