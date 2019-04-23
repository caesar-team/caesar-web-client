import { createSelector } from 'reselect';

export const userSelector = state => state.user;

export const keyPairSelector = createSelector(
  userSelector,
  user => user.keyPair,
);

export const masterPasswordSelector = createSelector(
  userSelector,
  user => user.masterPassword,
);

export const userDataSelector = createSelector(
  userSelector,
  user => user.data,
);
