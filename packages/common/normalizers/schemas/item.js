import { schema } from 'normalizr';
import { ENTITY_TYPE, TEAM_TYPE } from '@caesar/common/constants';
import { createPermissionsFromLinks } from '@caesar/common/utils/createPermissionsFromLinks';
import childItemSchema from './childItem';

const itemSchema = new schema.Entity(
  'itemsById',
  {
    invited: [childItemSchema],
  },
  {
    processStrategy: (entity, parent) => ({
      ...entity,
      listId: parent.id,
      _permissions: createPermissionsFromLinks(entity._links),
      teamId: parent.teamId || TEAM_TYPE.PERSONAL,
      __type: ENTITY_TYPE.ITEM,
    }),
  },
);

export default itemSchema;
