import axios from 'axios';
import Router from 'next/router';
import { API_URL, API_BASE_PATH } from './constants';
import { getToken, removeToken } from './utils/token';
import { isClient } from './utils/isEnvironment';

const softExit = () => {
  if (isClient) {
    removeToken();
    sessionStorage.setItem('isSetPassword', '0');

    if (window.location.pathname !== '/auth') {
      window.location.href = '/auth';
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

const processNotAuth = status => {
  switch (status) {
    case 'not_passed':
      Router.push({
        pathname: '/2fa',
        query: { isCheck: true },
      });
      break;
    case 'not_active':
      Router.push({
        pathname: '/2fa',
      });
      break;
    default:
      softExit();
      break;
  }
};

callApi.interceptors.response.use(
  config => config,
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          processNotAuth(error.response.data['2fa']);
          break;
        default:
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

export const createTwoFactor = data => callApi.post('/2fa/activate', data);

export const checkTwoFactor = data => callApi.post('/2fa', data);

export const getKeys = () => callApi.get('/keys');

export const getQrCode = () => callApi.get('/2fa');

// post
export const getList = token =>
  callApi.get('/list', {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

export const getItem = itemId => callApi.get(`/items/${itemId}`);

export const postCreateItem = data => callApi.post('/item', data);

export const getListItems = listId => callApi.get(`/item?listId=${listId}`);

export const removeItem = itemId => callApi.delete(`/item/${itemId}`);

export const updateMoveItem = (itemId, data) =>
  callApi.patch(`/item/${itemId}/move`, data);

export const updateItem = (itemId, data) =>
  callApi.patch(`/item/${itemId}`, data);

export const updateShareItem = (itemId, data) =>
  callApi.patch(`/item/${itemId}/share`, data);

export const postInviteItem = (itemId, data) =>
  callApi.post(`/invite/${itemId}`, data);

// list
export const postCreateList = data => callApi.post('/list', data);

export const updateList = (listId, data) =>
  callApi.patch(`list/${listId}`, data);

export const removeList = listId => callApi.delete(`/list/${listId}`);
