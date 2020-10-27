import { normalize } from 'normalizr';
import {
  listSchema,
  userSchema,
  teamSchema,
  keypairSchema,
  itemSchema,
  keypairItemSchema,
  shareItemSchema,
  memberSchema,
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

export const convertListsToEntities = lists => {
  const normalized = normalize(lists, [listSchema]);

  return normalized.entities.byId || {};
};

export const convertUsersToEntity = users => {
  const normalized = normalize(users, [userSchema]);

  return normalized.entities.byId || {};
};

export const convertMembersToEntity = members => {
  const normalized = normalize(members, [memberSchema]);

  return normalized.entities.byId || {};
};

export const convertTeamsToEntity = teams => {
  const normalized = normalize(teams, [teamSchema]);

  return normalized.entities.byId || {};
};

export const convertTeamNodesToEntities = teams => {
  const normalized = normalize(teams, [teamSchema]);

  return {
    teams: normalized.entities.teamsById || {},
    members: normalized.entities.membersById || {},
  };
};

export const convertKeyPairToEntity = (keypairs, idAttribute = 'teamId') => {
  const normalized = normalize(keypairs, [keypairSchema(idAttribute)]);

  return normalized.entities.byId || {};
};

export const convertKeyPairToItemEntity = keypairs => {
  const normalized = normalize(keypairs, [keypairItemSchema]);

  return normalized.entities.byId || {};
};
