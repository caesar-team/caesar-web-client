import { normalize } from 'normalizr';
import { listSchema, memberSchema } from './schemas';
import { getFavoritesList } from './utils';

export const convertNodesToEntities = nodes => {
  const normalized = normalize(nodes, [listSchema]);

  const entities = {
    listsById: normalized.entities.listsById || {},
    itemsById: normalized.entities.itemsById || {},
    childItemsById: normalized.entities.childItemsById || {},
  };

  const favoritesList = getFavoritesList(entities.itemsById);

  return {
    ...entities,
    listsById: {
      ...entities.listsById,
      [favoritesList.id]: favoritesList,
    },
  };
};

export const convertMembersToEntity = members => {
  const normalized = normalize(members, [memberSchema]);

  return normalized.entities.byId || {};
};
