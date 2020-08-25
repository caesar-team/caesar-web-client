import { createSelector } from 'reselect';
import {
  currentTeamIdSelector,
  isUserAnonymousSelector,
  userIdSelector,
} from '@caesar/common/selectors/user';
import { generateSystemItemName } from '@caesar/common/utils/item';
import { KEY_TYPE, TEAM_TYPE, ENTITY_TYPE } from '@caesar/common/constants';

const findEntityItemsByType = (data, entityType) =>
  Object.values(data[KEY_TYPE.ENTITY]).filter(({ data }) => data.name.includes(entityType)) || [];

const findTeamItemByName = (items, teamId) =>
  items.find(
    ({ data }) => data.name === generateSystemItemName(ENTITY_TYPE.TEAM, teamId),
  ) || {};

const findItemsByNames = (items, itemIds) =>
  itemIds.map(itemId => items.find(
    ({ data }) => data.name === generateSystemItemName(ENTITY_TYPE.ITEM, itemId),
  ) || {});

export const keyStoreSelector = state => state.keyStore;

const teamIdPropSelector = (_, props) => props.teamId;

const itemIdsPropSelector = (_, props) => props.itemIds;

export const entityTeamSelector = createSelector(
  keyStoreSelector,
  data => findEntityItemsByType(data, ENTITY_TYPE.TEAM),
);

export const entityItemSelector = createSelector(
  keyStoreSelector,
  data => findEntityItemsByType(data, ENTITY_TYPE.ITEM),
);

export const personalKeyPairSelector = createSelector(
  keyStoreSelector,
  keyStore => keyStore[KEY_TYPE.PERSONAL] || {},
);

export const teamKeyPairSelector = createSelector(
  entityTeamSelector,
  teamIdPropSelector,
  (data, teamId) => findTeamItemByName(data, teamId),
);

export const itemsKeyPairSelector = createSelector(
  entityItemSelector,
  itemIdsPropSelector,
  (data, itemIds) => findItemsByNames(data, itemIds),
);

export const anonymousKeyPairSelector = createSelector(
  keyStoreSelector,
  data => Object.values(data[KEY_TYPE.ANONYMOUS]) || {},
);

export const actualKeyPairSelector = createSelector(
  keyStoreSelector,
  currentTeamIdSelector,
  personalKeyPairSelector,
  isUserAnonymousSelector,
  userIdSelector,
  (data, currentTeamId, personalKeyPair, isAnonymous, userId) => {
    switch (true) {
      case isAnonymous:
        return (
          Object.values(data[KEY_TYPE.ANONYMOUS]).find(({ id }) => userId) || {}
        );
      case currentTeamId !== TEAM_TYPE.PERSONAL:
        return findTeamItemByName(data, currentTeamId);
      case currentTeamId === TEAM_TYPE.PERSONAL:
        return personalKeyPair;
      default:
        return null;
    }
  },
);
