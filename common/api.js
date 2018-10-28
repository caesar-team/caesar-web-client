import axios from 'axios';
import { API_URL } from './constants';
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
  baseURL: `${API_URL}/api`,
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

export const postSetMaster = password =>
  callApi.post('/master/set', { master: password });

export const postCheckMaster = password =>
  callApi.post('/master/check', { master: password });

export const getPasswordStatus = () => callApi.post('/master/created');

// post
export const getList = token =>
  callApi.get('/list', {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

export const getPost = postId => callApi.get(`/posts/${postId}`);

export const postCreatePost = data => callApi.post('/post', data);

export const getListPosts = listId => callApi.get(`/post?listId=${listId}`);

export const removePost = postId => callApi.delete(`/post/${postId}`);

export const updateMovePost = (postId, data) =>
  callApi.patch(`/post/${postId}/move`, data);

export const updatePost = (postId, data) =>
  callApi.patch(`/post/${postId}`, data);

export const updateSharePost = (postId, data) =>
  callApi.patch(`/post/${postId}/share`, data);

// list
export const postCreateList = data => callApi.post('/list', data);

export const updateList = (listId, data) =>
  callApi.patch(`list/${listId}`, data);

export const removeList = listId => callApi.delete(`/list/${listId}`);
