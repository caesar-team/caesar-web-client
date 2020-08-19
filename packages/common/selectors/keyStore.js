import { createSelector } from 'reselect';
import {
  currentTeamIdSelector,
  isUserAnonymousSelector,
  userIdSelector,
} from '@caesar/common/selectors/user';
import { generateSystemItemName } from '@caesar/common/utils/item';
import { KEY_TYPE, TEAM_TYPE } from '@caesar/common/constants';

const findTeamItemByName = (data, teamId) =>
  Object.values(data[KEY_TYPE.TEAM]).find(
    ({ name }) => name === generateSystemItemName('team', teamId),
  ) || {};

export const keyStoreSelector = state => state.keyStore;

const teamIdPropSelector = (_, props) => props.teamId;

export const keyStoreDataSelector = createSelector(
  keyStoreSelector,
  keyStore => keyStore.data,
);

export const personalKeyPairSelector = createSelector(
  keyStoreDataSelector,
  keyStore => keyStore[KEY_TYPE.PERSONAL] || {},
);

export const teamKeyPairSelector = createSelector(
  keyStoreDataSelector,
  teamIdPropSelector,
  (data, teamId) => findTeamItemByName(data, teamId),
);

export const anonymousKeyPairSelector = createSelector(
  keyStoreDataSelector,
  (data, teamName) => Object.values(data[KEY_TYPE.ANONYMOUS]) || {},
);

export const actualKeyPairSelector = createSelector(
  keyStoreDataSelector,
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
