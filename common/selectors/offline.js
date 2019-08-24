import { createSelector } from 'reselect';

const offlineSelector = state => state.offline;

export const isOnlineSelector = createSelector(
  offlineSelector,
  offline => offline.online,
);
