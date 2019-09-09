import { createSelector } from 'reselect';

const offlineSelector = state => state.offline;

export const isOnlineSelector = createSelector(
  offlineSelector,
  offline => offline.online,
);

export const applicationSelector = state => state.application;

export const versionsSelector = createSelector(
  applicationSelector,
  application => application.versions,
);

export const clientVersionSelector = createSelector(
  versionsSelector,
  versions => versions.client,
);
export const serverVersionSelector = createSelector(
  versionsSelector,
  versions => versions.server,
);

export const availableCoresCountSelector = createSelector(
  applicationSelector,
  application => application.availableCoresCount,
);
