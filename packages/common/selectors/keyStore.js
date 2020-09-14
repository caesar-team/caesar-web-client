import { createSelector } from 'reselect';
import {
  currentTeamIdSelector,
  isUserAnonymousSelector,
  userIdSelector,
} from '@caesar/common/selectors/user';
import { generateSystemItemName } from '@caesar/common/utils/item';
import { KEY_TYPE, TEAM_TYPE, ENTITY_TYPE } from '@caesar/common/constants';

const findTeamByItemName = (data, teamId) =>
  Object.values(data).find(
    ({ name }) => name === generateSystemItemName(ENTITY_TYPE.TEAM, teamId),
  ) || {};

export const keyStoreSelector = state => state.keyStore;

const teamsSelector = createSelector(
  keyStoreSelector,
  keyStore => keyStore[KEY_TYPE.TEAMS],
);

export const shareKeyPairsSelector = createSelector(
  keyStoreSelector,
  keyStore => {
    return keyStore[KEY_TYPE.SHARES];
  },
);

export const keyPairsStoreSelector = createSelector(
  shareKeyPairsSelector,
  teamsSelector,
  (sharesKeys, teamKeys) => [...sharesKeys, ...teamKeys],
);

const teamIdPropSelector = (_, props) => props.teamId;

const idsPropSelector = (_, props) => props.ids;

export const personalKeyPairSelector = createSelector(
  keyStoreSelector,
  keyStore => keyStore[KEY_TYPE.PERSONAL] || {},
);

export const teamKeyPairSelector = createSelector(
  teamsSelector,
  teamIdPropSelector,
  (data, teamId) => findTeamByItemName(data, teamId),
);

export const idsKeyPairsSelector = createSelector(
  keyPairsStoreSelector,
  idsPropSelector,
  (keys, ids) => ids.map(itemId => keys[itemId]),
);

const shareIdPropSelector = (_, props) => props.id;
export const shareKeyPairSelector = createSelector(
  shareKeyPairsSelector,
  shareIdPropSelector,
  (shares, id) => shares[id] || null,
);

export const shareKeysPairSelector = createSelector(
  shareKeyPairsSelector,
  idsPropSelector,
  (shares, ids) => {
    const keys = {};

    ids.forEach(id => {
      if (shares[id]) {
        keys[id] = shares[id];
      }
    });

    return keys;
  },
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
          Object.values(data[KEY_TYPE.ANONYMOUS]).find(
            ({ id }) => id === userId,
          ) || {}
        );
      case currentTeamId !== TEAM_TYPE.PERSONAL:
        return findTeamByItemName(data, currentTeamId);
      case currentTeamId === TEAM_TYPE.PERSONAL:
        return personalKeyPair;
      default:
        return null;
    }
  },
);
