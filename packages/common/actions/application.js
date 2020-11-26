import { getWorkersCount } from '@caesar/common/utils/worker';

export const UPDATE_GLOBAL_NOTIFICATION = '@app/UPDATE_GLOBAL_NOTIFICATION';
export const SET_APPLICATION_VERSION = '@app/SET_APPLICATION_VERSION';
export const INIT_CORES_COUNT = '@app/INIT_CORES_COUNT';
export const INCREASE_CORES_COUNT = '@app/INCREASE_CORES_COUNT';
export const DECREASE_CORES_COUNT = '@app/DECREASE_CORES_COUNT';
export const REHYDRATE_STORE = '@workflow/REHYDRATE_STORE';
export const RESET_STORE = '@workflow/RESET_STORE';
export const RESET_APPLICATION_STATE = '@app/RESET_APPLICATION_STATE';

export const RESET_APPLICATION_CACHE = '@app/RESET_APPLICATION_CACHE';

export const ENCRYPTION_FINISHED_EVENT = '@app/ENCRYPTION_FINISHED_EVENT';
export const DECRYPTION_FINISHED = '@app/DECRYPTION_FINISHED';

export const updateGlobalNotification = (text, isLoading, isError = false) => ({
  type: UPDATE_GLOBAL_NOTIFICATION,
  payload: {
    isLoading,
    isError,
    text,
  },
});

export const setApplicationVersion = (environment, version) => ({
  type: SET_APPLICATION_VERSION,
  payload: {
    version,
  },
});

export const initCoresCount = () => ({
  type: INIT_CORES_COUNT,
  payload: {
    count: getWorkersCount(),
  },
});

export const increaseCoresCount = delta => ({
  type: INCREASE_CORES_COUNT,
  payload: {
    delta,
  },
});

export const decreaseCoresCount = delta => ({
  type: DECREASE_CORES_COUNT,
  payload: {
    delta,
  },
});

export const rehydrateStore = () => ({
  type: REHYDRATE_STORE,
});

export const resetStore = () => ({
  type: RESET_STORE,
});

export const encryptionFinishedEvent = sets => ({
  type: ENCRYPTION_FINISHED_EVENT,
  payload: {
    sets,
  },
});

export const resetApplicationState = () => ({
  type: RESET_APPLICATION_STATE,
});

export const resetApplicationCache = () => ({
  type: RESET_APPLICATION_CACHE,
});
