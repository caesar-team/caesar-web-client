import { schema } from 'normalizr';
import {
  ENTITY_TYPE,
  PERMISSION_ENTITY,
  TEAM_TYPE,
} from '@caesar/common/constants';
import { createPermissionsFromLinks } from '@caesar/common/utils/createPermissionsFromLinks';

const itemSchema = new schema.Entity(
  'itemsById',
  {},
  {
    processStrategy: (entity, parent) => ({
      ...entity,
      _permissions: {
        ...createPermissionsFromLinks(entity._links),
        __typename:
          entity.teamId !== TEAM_TYPE.PERSONAL
            ? PERMISSION_ENTITY.TEAM_ITEM
            : PERMISSION_ENTITY.ITEM,
      },
      teamId: entity.teamId || parent.teamId || TEAM_TYPE.PERSONAL, // If item is personal, it does not have enough time to normalize list data. Need to set 'personal' teamId explicitly
      __type: ENTITY_TYPE.ITEM,
    }),
  },
);

export default itemSchema;
