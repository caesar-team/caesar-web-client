import { normalize } from 'normalizr';
import { listSchema, itemSchema, memberSchema } from './schemas';
import {
  createUnionSchema,
  removeSchemaPropFromLists,
  removeParentList,
  getFavoritesList,
} from './utils';

listSchema.define({
  children: [createUnionSchema({ list: listSchema, item: itemSchema })],
});

export const convertNodesToEntities = nodes => {
  const normalized = normalize(nodes, [listSchema]);

  const entities = {
    listsById: removeSchemaPropFromLists(
      removeParentList(normalized.entities.listsById || {}),
    ),
    itemsById: normalized.entities.itemsById || {},
    childItemsById: normalized.entities.childItemsById || {},
  };

  console.log('entites', entities);

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
