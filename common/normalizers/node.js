import { normalize, schema } from 'normalizr';
import { uuid4 } from 'common/utils/uuid4';
import { FAVORITES_TYPE } from 'common/constants';

const item = new schema.Entity('itemsById');
const list = new schema.Entity(
  'listsById',
  {},
  {
    processStrategy: (entity, parent) => ({
      ...entity,
      parentId: parent.id || null,
    }),
  },
);

const union = new schema.Union(
  {
    list,
    item,
  },
  entity => (entity.type === 'list' ? 'list' : 'item'),
);

list.define({ children: [union] });

export const normalizeNodes = nodes => {
  const normalized = normalize(nodes, [list]);

  const entities = {
    listsById: normalized.entities.listsById || {},
    itemsById: normalized.entities.itemsById || {},
  };

  const favorites = Object.values(entities.itemsById)
    .filter(({ favorite }) => favorite)
    .map(({ id }) => ({ id }));
  const favoriteListId = uuid4();

  return {
    ...entities,
    listsById: {
      ...entities.listsById,
      [favoriteListId]: {
        id: favoriteListId,
        type: FAVORITES_TYPE,
        label: 'Favorites',
        children: favorites,
      },
    },
  };
};
