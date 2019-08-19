import { schema } from 'normalizr';
import { uuid4 } from 'common/utils/uuid4';
import { FAVORITES_TYPE, ITEM_TYPES_ARRAY } from 'common/constants';

const resolveKeyToEntity = ({ type }) => {
  switch (true) {
    case type === 'list':
      return 'list';
    case ITEM_TYPES_ARRAY.includes(type):
      return 'item';
    default:
      return 'childItem';
  }
};

export const createUnionSchema = schemas =>
  new schema.Union(schemas, resolveKeyToEntity);

export const getFavoritesList = itemsById => {
  const favoriteListId = uuid4();
  const favorites = Object.values(itemsById)
    .filter(({ favorite }) => favorite)
    .map(({ id }) => ({ id }));

  return {
    id: favoriteListId,
    type: FAVORITES_TYPE,
    label: 'Favorites',
    children: favorites,
  };
};
