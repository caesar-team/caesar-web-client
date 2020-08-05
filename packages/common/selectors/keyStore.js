import { createSelector } from 'reselect';
import { generateSystemItemName } from '@caesar/common/utils/item';

export const keyStoreSelector = state => state.keyStore;

const teamNamePropSelector = (_, props) => props.teamName;

export const keyStoreDataSelector = createSelector(
  keyStoreSelector,
  keyStore => keyStore.data,
);

export const teamKeysSelector = createSelector(
  keyStoreDataSelector,
  teamNamePropSelector,
  (data, teamName) =>
    Object.values(data).find(({ name }) => name === generateSystemItemName(teamName)) || {},
);
