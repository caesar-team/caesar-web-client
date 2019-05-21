import axios from 'axios';
import { getToken, removeToken } from './utils/token';
import { isClient } from './utils/isEnvironment';

const softExit = () => {
  if (isClient) {
    removeToken();

    // TODO: change via Router
    if (window.location.pathname !== '/signin') {
      window.location.href = '/signin';
    }
  }
};

const callApi = axios.create({
  baseURL: 'http://loc.caesar.team/api',
  withCredentials: true,
});

// callApi.interceptors.request.use(config => {
//   // const token = getToken();
//
//   return {
//     ...config,
//     headers: {
//       ...config.headers,
//       Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1NTgwOTI0MjMsImV4cCI6MTU1ODE3ODgyMywicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoiRG1pdHJpeSBTcGlyaWRvbm92In0.RCYul7JZflJ7k7s_lsRJudNWIJyo19lypmgQVWfqlthbQWXvUSFqA36iNRYrPI9e5xv7irwAtCrOeS2PK-dcH-QcwnVUrYHaJJHK4JUY_zq5OmGYBVjqaePWdR5bFh4k8VG0e2lkWI2M0adZlDVMife6WZZ3fONDlMuL1-ZWQsXmI-mPMegZepoeBWhkFfxofayhiPViR1n4FfUeAXVe8baPt_zmG8ALNi4WCKk92ec0tJER3K4gb4jdp-0AYQHvfNf6x7dd1bd1amstK4TsLUxHFlimm6DXkMRiJUcdZqd9WRzERxM6Dq4c8TpIJnO51U8A9_0jycs1iUUlNZ8jzt_SjBT2ymAvGVsUl6PSOIly1E3K8tKPRG4maEOrJeNwXrUBgRHDhTrQNzaOLCShcQ23BQHiPvmAF42loILgHMRsuFWgZW6pK5UbNqYTJET4uEavHj4K2m-2zff6zErjR90hyToT6gfJwyyycE6LtMHcdUViqOB7sT94YkX0W5bGDaJwqF5eJWCfhv_0w-V8knyrsvHpQUNkX9gaaLSOJG3e2Hnl6reB873UYKf8fjWC9Kw1NH8LWq0UYPyvjt90Pm6AHnU_PSiucuXSoC9jbbJ5bay3FTbteB4Q4gVSxdw6dLW_AOsNYSHGNVxyMb2N5cMMtY-nmNRryduKhzEpzc4`
//     },
//   }
// });

callApi.interceptors.response.use(
  config => config,
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          softExit();
          break;
        default:
          // console.log(error.response.data);
          break;
      }
    }

    return Promise.reject(error);
  },
);

// user
export const getUserSelf = token =>
  callApi.get('/user/self', {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

export const getUsers = token =>
  callApi.get('/user', {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

export const postKeys = data => callApi.post('/keys', data);

export const getKeys = () => callApi.get('/keys');

export const getQrCode = () => callApi.get('/auth/2fa');

export const getBackupCodes = () => callApi.get('/auth/2fa/backups');

export const postActivateTwoFactor = data =>
  callApi.post('/auth/2fa/activate', data);

export const postCheckTwoFactor = data => callApi.post('/auth/2fa', data);

// post
export const getList = token =>
  callApi.get('/list', {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

export const patchListSort = (listId, data) =>
  callApi.patch(`/list/${listId}/sort`, data);

export const getUserBootstrap = () => callApi.get('/user/security/bootstrap');

export const postCreateItem = data => callApi.post('/item', data);

export const removeItem = itemId => callApi.delete(`/item/${itemId}`);

export const updateMoveItem = (itemId, data) =>
  callApi.patch(`/item/${itemId}/move`, data);

export const updateItem = (itemId, data) =>
  callApi.patch(`/item/${itemId}`, data);

export const postCreateChildItem = (itemId, data) =>
  callApi.post(`/item/${itemId}/child_item`, data);

export const patchChildAccess = (childItemId, data) =>
  callApi.patch(`/child_item/${childItemId}/access`, data);

export const patchChildItem = (childItemId, data) =>
  callApi.patch(`/child_item/${childItemId}`, data);

export const acceptUpdateItem = itemId =>
  callApi.post(`/item/${itemId}/accept_update`);

export const rejectUpdateItem = itemId =>
  callApi.post(`/item/${itemId}/decline_update`);

export const removeChildItem = childItemId =>
  callApi.delete(`/child_item/${childItemId}`);

// list
export const postCreateList = data => callApi.post('/list', data);

export const patchList = (listId, data) =>
  callApi.patch(`/list/${listId}`, data);

export const removeList = listId => callApi.delete(`/list/${listId}`);

export const toggleFavorite = id => callApi.post(`/item/${id}/favorite`);

export const getPublicKeyByEmail = email => callApi.get(`/key/${email}`);

export const postNewUser = data => callApi.post('/user', data);

export const postLoginPrepare = data =>
  callApi.post('/auth/srpp/login_prepare', data);

export const postLogin = data => callApi.post('/auth/srpp/login', data);

export const postRegistration = data =>
  callApi.post('/auth/srpp/registration', data);

export const postChangePassword = data =>
  callApi.patch('/auth/srpp/password', data);

export const getCheckShare = id => callApi.get(`/anonymous/share/${id}/check`);

export const postInvitation = data => callApi.post('/invitation', data);

export const patchChildItemBatch = data =>
  callApi.patch('/child_item/batch', data);

export const getOfferedItems = () => callApi.get('/offered_item');

export const patchAcceptItem = data => callApi.patch('/accept_item', data);

export const patchResetPassword = (token, data) =>
  callApi.patch(`/auth/srpp/reset/${token}`, data);

export const postSecureMessage = data => callApi.post('/message', data);

export const getSecureMessage = id => callApi.get(`/message/${id}`);
