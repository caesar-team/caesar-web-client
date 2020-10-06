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
      teamId: entity.teamId || parent.teamId || TEAM_TYPE.PERSONAL, // If item is personal, it does not have enough time to normalize list data. Need to set 'personal' teamId explicitly
      __type: ENTITY_TYPE.ITEM,
    }),
  },
);

export default itemSchema;
