import { normalize } from 'normalizr';
import {
  listSchema,
  memberSchema,
  teamSchema,
  keypairSchema,
  itemSchema,
  keypairItemSchema,
  shareItemSchema,
} from '@caesar/common/normalizers/schemas';

export const convertItemsToEntities = items => {
  const normalized = normalize(items, [itemSchema()]);

  return {
    itemsById: normalized.entities.itemsById || {},
  };
};

export const convertShareItemsToEntities = ({
  items,
  currentUserId,
  defaultListId,
}) => {
  const { itemsById } = convertItemsToEntities(items);

  const normalized = normalize(Object.values(itemsById), [
    shareItemSchema({ currentUserId, defaultListId }),
  ]);

  return {
    itemsById: normalized.entities.byId || {},
  };
};

export const convertListsToEntities = nodes => {
  const normalized = normalize(nodes, [listSchema]);

  return {
    listsById: normalized.entities.listsById || {},
  };
};

export const convertNodesToEntities = nodes => {
  const normalized = normalize(nodes, [listSchema]);

  return {
    listsById: normalized.entities.listsById || {},
    itemsById: normalized.entities.itemsById || {},
  };
};

export const convertMembersToEntity = members => {
  const normalized = normalize(members, [memberSchema]);

  return normalized.entities.byId || {};
};

export const convertTeamsToEntity = teams => {
  const normalized = normalize(teams, [teamSchema]);

  return normalized.entities.byId || {};
};

export const convertKeyPairToEntity = (keypairs, idAttribute = 'teamId') => {
  const normalized = normalize(keypairs, [keypairSchema(idAttribute)]);

  return normalized.entities.byId || {};
};

export const convertKeyPairToItemEntity = keypairs => {
  const normalized = normalize(keypairs, [keypairItemSchema]);

  return normalized.entities.byId || {};
};
