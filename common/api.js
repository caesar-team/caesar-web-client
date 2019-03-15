import axios from 'axios';
import { API_URL, API_BASE_PATH } from './constants';
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
  baseURL: `${API_URL}/${API_BASE_PATH}`,
});

callApi.interceptors.request.use(config => {
  const token = getToken();

  return token
    ? {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${getToken()}`,
        },
      }
    : config;
});

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

export const getQrCode = () => callApi.get('/2fa');

export const getBackupCodes = () => callApi.get('/auth/2fa/backups');

export const postActivateTwoFactor = data =>
  callApi.post('/2fa/activate', data);

export const postCheckTwoFactor = data => callApi.post('/2fa', data);

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

export const postInviteItem = (itemId, data) =>
  callApi.post(`/item/${itemId}/invite`, data);

export const changeInviteItem = (itemId, data) =>
  callApi.put(`/item/${itemId}/invite`, data);

export const acceptUpdateItem = itemId =>
  callApi.post(`/item/${itemId}/accept_update`);

export const changeInviteAccess = (inviteId, data) =>
  callApi.patch(`/invite/${inviteId}`, data);

export const deleteInviteItem = (inviteId, data) =>
  callApi.delete(`/invite/${inviteId}`, data);

// list
export const postCreateList = data => callApi.post('/list', data);

export const patchList = (listId, data) =>
  callApi.patch(`/list/${listId}`, data);

export const removeList = listId => callApi.delete(`/list/${listId}`);

export const toggleFavorite = id => callApi.post(`/item/${id}/favorite`);

export const getPublicKeyByEmail = email => callApi.get(`/key/${email}`);

export const postNewUser = data => callApi.post('/user', data);

export const postShare = data => callApi.post('/share', data);

export const postShares = data => callApi.post('/shares', data);

export const updateShares = data => callApi.patch('/shares', data);

export const updateShare = (id, data) => callApi.patch(`/shares/${id}`, data);

export const deleteShare = id => callApi.delete(`/shares/${id}`);

export const postLoginPrepare = data =>
  callApi.post('/srp/login_prepare', data);

export const postLogin = data => callApi.post('/srp/login', data);

export const postRegistration = data => callApi.post('/srp/registration', data);

export const postChangePassword = data => callApi.patch('/srp/password', data);

export const getCheckShare = id => callApi.get(`/anonymous/share/${id}/check`);

export const getMaskedItems = () => callApi.get('/item_mask');

export const postItemMask = id => callApi.post(`/item_mask/${id}`);

export const postItemMasks = data => callApi.post('/item_mask', data);

export const deleteItemMasks = data => callApi.delete('/item_mask', data);

export const postInvitation = data => callApi.post('/invitation', data);

export const patchItemBatch = data => callApi.put('/item/batch', data);
