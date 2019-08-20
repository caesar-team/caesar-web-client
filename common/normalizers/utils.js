import { schema } from 'normalizr';
import { uuid4 } from 'common/utils/uuid4';
import { FAVORITES_TYPE, ITEM_TYPES_ARRAY, LIST_TYPE } from 'common/constants';

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

export const removeSchemaPropFromLists = listsById =>
  Object.keys(listsById).reduce(
    (accumulator, listId) => ({
      ...accumulator,
      [listId]: {
        ...listsById[listId],
        children: listsById[listId].children.map(({ id }) => id),
      },
    }),
    {},
  );

export const removeParentList = listsById =>
  Object.keys(listsById).reduce((accumulator, listId) => {
    const list = listsById[listId];

    if (list.type === LIST_TYPE && !list.parentId) {
      return accumulator;
    }

    return { ...accumulator, [listId]: list };
  }, {});
