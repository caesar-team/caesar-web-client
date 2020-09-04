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

const findSharesByItemNames = (data, shareIds) =>
  shareIds.map(
    shareId =>
      Object.values(data).find(
        ({ name }) => name === generateSystemItemName(ENTITY_TYPE.SHARE, shareId),
      ) || {},
  );

export const keyStoreSelector = state => state.keyStore;

const teamsSelector = createSelector(
  keyStoreSelector,
  keyStore => keyStore[KEY_TYPE.TEAMS],
);

const sharesSelector = createSelector(
  keyStoreSelector,
  keyStore => keyStore[KEY_TYPE.SHARES],
);

const teamIdPropSelector = (_, props) => props.teamId;

const shareIdsPropSelector = (_, props) => props.shareIds;

export const personalKeyPairSelector = createSelector(
  keyStoreSelector,
  keyStore => keyStore[KEY_TYPE.PERSONAL] || {},
);

export const teamKeyPairSelector = createSelector(
  teamsSelector,
  teamIdPropSelector,
  (data, teamId) => findTeamByItemName(data, teamId),
);

export const sharesKeyPairSelector = createSelector(
  sharesSelector,
  shareIdsPropSelector,
  (data, shareIds) => findSharesByItemNames(data, shareIds),
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
