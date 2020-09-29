import { schema } from 'normalizr';
import { ENTITY_TYPE, TEAM_TYPE } from '@caesar/common/constants';
import { createPermissionsFromLinks } from '@caesar/common/utils/createPermissionsFromLinks';

const itemSchema = new schema.Entity(
  'itemsById',
  {},
  {
    processStrategy: (entity, parent) => ({
      ...entity,
      _permissions: createPermissionsFromLinks(entity._links),
      teamId: parent.teamId || TEAM_TYPE.PERSONAL,
      __type: ENTITY_TYPE.ITEM,
    }),
  },
);

export default itemSchema;
