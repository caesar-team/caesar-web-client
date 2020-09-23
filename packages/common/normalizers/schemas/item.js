import { schema } from 'normalizr';
import { ENTITY_TYPE, TEAM_TYPE } from '@caesar/common/constants';
import childItemSchema from './childItem';

const itemSchema = new schema.Entity(
  'itemsById',
  {
    invited: [childItemSchema],
  },
  {
    processStrategy: (entity, parent) => ({
      ...entity,
      listId: entity.listId || parent.id || null,
      _permissions: entity._links
        ? Object.keys(entity._links).reduce(
            (accumulator, key) => ({
              ...accumulator,
              [key]: !!entity._links[key],
            }),
            {},
          )
        : {},
      isShared: entity.isShared,
      teamId: parent.teamId || entity.teamId || TEAM_TYPE.PERSONAL,
      __type: ENTITY_TYPE.ITEM,
    }),
  },
);

export default itemSchema;
