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
  currentUserSchema,
} from './schemas';

const failIsNotAnArray = arrayObject => {
  if (!Array.isArray(arrayObject))
    throw new Error('The object should be an Array type.');

  return true;
};
export const convertItemsToEntities = items => {
  failIsNotAnArray(items);
  const normalized = normalize(items, [itemSchema]);

  return {
    itemsById: normalized.entities.itemsById || {},
  };
};

export const convertShareItemsToEntities = ({
  items,
  currentUserId,
  defaultListId,
}) => {
  failIsNotAnArray(items);
  const { itemsById } = convertItemsToEntities(items);

  const normalized = normalize(Object.values(itemsById), [
    shareItemSchema({ currentUserId, defaultListId }),
  ]);

  return {
    itemsById: normalized.entities.shareItemById || {},
  };
};

export const convertListsToEntities = lists => {
  const normalized = normalize(lists, [listSchema]);

  return normalized.entities.listsById || {};
};

export const convertUsersToEntity = users => {
  failIsNotAnArray(users);
  const normalized = normalize(users, [userSchema]);

  return normalized.entities.usersById || {};
};

export const convertMembersToEntity = members => {
  failIsNotAnArray(members);
  const normalized = normalize(members, [memberSchema]);

  return normalized.entities.membersById || {};
};

export const convertTeamsToEntity = teams => {
  failIsNotAnArray(teams);
  const normalized = normalize(teams, [teamSchema]);

  return normalized.entities.teamsById || {};
};

export const convertTeamNodesToEntities = teams => {
  const normalized = normalize(teams, [teamSchema]);

  return {
    teams: normalized.entities.teamsById || {},
    members: normalized.entities.membersById || {},
  };
};

export const convertKeyPairToEntity = (keypairs, idAttribute = 'teamId') => {
  failIsNotAnArray(keypairs);
  const normalized = normalize(keypairs, [keypairSchema(idAttribute)]);

  return normalized.entities.keyPairById || {};
};

export const convertKeyPairToItemEntity = keypairs => {
  failIsNotAnArray(keypairs);
  const normalized = normalize(keypairs, [keypairItemSchema]);

  return normalized.entities.keyPairItemById || {};
};

export const normalizeCurrentUser = currentUser => {
  const normalized = normalize([currentUser], [currentUserSchema]);

  return normalized.entities.user[currentUser.id] || {};
};
