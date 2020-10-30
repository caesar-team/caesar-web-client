import { createSelector } from 'reselect';
import {
  currentTeamIdSelector,
  isUserAnonymousSelector,
  currentUserIdSelector,
} from '@caesar/common/selectors/currentUser';
import { generateSystemItemName } from '@caesar/common/utils/item';
import { KEY_TYPE, ENTITY_TYPE } from '@caesar/common/constants';

const findSystemItemsTeamByItemName = (data, teamId) =>
  Object.values(data).find(
    ({ name }) => name === generateSystemItemName(ENTITY_TYPE.TEAM, teamId),
  ) || {};

export const keyStoreSelector = state => state.keystore;

export const anonymousKeyPairsSelector = createSelector(
  keyStoreSelector,
  keystore => keystore[KEY_TYPE.ANONYMOUS],
);

export const teamKeyPairsSelector = createSelector(
  keyStoreSelector,
  keystore => keystore[KEY_TYPE.TEAMS],
);

export const shareKeyPairsSelector = createSelector(
  keyStoreSelector,
  keystore => {
    return keystore[KEY_TYPE.SHARES];
  },
);

const itemIdPropSelector = (_, props) => props.itemId;
export const shareItemKeyPairSelector = createSelector(
  shareKeyPairsSelector,
  itemIdPropSelector,
  (keyPairs, itemId) => {
    return keyPairs[itemId];
  },
);

const teamIdPropSelector = (_, props) => props.teamId;

const idsPropSelector = (_, props) => props.ids;

export const teamKeyPairSelector = createSelector(
  teamKeyPairsSelector,
  teamIdPropSelector,
  (keyPairs, teamId) => keyPairs[teamId] || null,
);

const shareItemIdPropSelector = (_, props) => props.itemId;
export const shareKeyPairSelector = createSelector(
  shareKeyPairsSelector,
  shareItemIdPropSelector,
  (shares, itemId) => shares[itemId] || null,
);

export const shareKeysPairSelector = createSelector(
  shareKeyPairsSelector,
  idsPropSelector,
  (shares, ids) => Object.values(shares).filter(key => ids.includes(key.id)),
);

export const anonymousKeyPairSelector = createSelector(
  keyStoreSelector,
  data => Object.values(data[KEY_TYPE.ANONYMOUS]) || {},
);

export const idsKeyPairsSelector = createSelector(
  shareKeyPairsSelector,
  teamKeyPairsSelector,
  anonymousKeyPairsSelector,
  idsPropSelector,
  (shares, teams, anons, ids) =>
    ids.map(itemId => {
      return {
        share: shares[itemId] || null,
        team: teams[itemId] || null,
        anon: anons[itemId] || null,
      };
    }),
);

export const actualKeyPairSelector = createSelector(
  keyStoreSelector,
  currentTeamIdSelector,
  isUserAnonymousSelector,
  currentUserIdSelector,
  (data, currentTeamId, isAnonymous, userId) => {
    switch (true) {
      case isAnonymous:
        return (
          Object.values(data[KEY_TYPE.ANONYMOUS]).find(
            ({ id }) => id === userId,
          ) || {}
        );
      case !!currentTeamId:
        return findSystemItemsTeamByItemName(data, currentTeamId);
      default:
        return null;
    }
  },
);
