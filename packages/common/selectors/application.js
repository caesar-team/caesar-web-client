import { createSelector } from 'reselect';

const offlineSelector = state => state.offline;

export const isOnlineSelector = createSelector(
  offlineSelector,
  offline => offline.online,
);

export const applicationSelector = state => state.application;

export const globalNotificationSelector = createSelector(
  applicationSelector,
  application => application.globalNotification,
);

export const isLoadingGlobalNotificationSelector = createSelector(
  globalNotificationSelector,
  globalNotification => globalNotification.isLoading,
);

export const isErrorGlobalNotificationSelector = createSelector(
  globalNotificationSelector,
  globalNotification => globalNotification.isError,
);

export const globalNotificationTextSelector = createSelector(
  globalNotificationSelector,
  globalNotification => globalNotification.text,
);

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

export const maxCoresCountSelector = createSelector(
  applicationSelector,
  application => application.maxCoresCount,
);
