import { normalize } from 'normalizr';
import {
  listSchema,
  memberSchema,
  teamSchema,
  keypairSchema,
  itemSchema,
  keypairItemSchema,
} from '@caesar/common/normalizers/schemas';

export const convertItemsToEntities = items => {
  const normalized = normalize(items, [itemSchema]);

  return {
    itemsById: normalized.entities.itemsById || {},
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
