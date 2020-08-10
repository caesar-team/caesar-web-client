import { createSelector } from 'reselect';
import { generateSystemItemName } from '@caesar/common/utils/item';
import { KEY_TYPE } from '../constants';

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
  (data, teamName) =>
    Object.values(data[KEY_TYPE.TEAM]).find(({ name }) => name === generateSystemItemName(teamId)) || {},
);

export const anonymousKeyPairSelector = createSelector(
  keyStoreDataSelector,
  (data, teamName) => Object.values(data[KEY_TYPE.ANONYMOUS]) || {},
);
