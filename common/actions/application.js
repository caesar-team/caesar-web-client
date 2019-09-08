export const SET_APPLICATION_VERSION = '@app/SET_APPLICATION_VERSION';

export const setApplicationVersion = (environment, version) => ({
  type: SET_APPLICATION_VERSION,
  payload: {
    version,
  },
});
