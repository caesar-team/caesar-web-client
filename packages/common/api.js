// TODO: Rewrite all this requests with fetch 'packages/common/fetch.js'
import Router from 'next/router';
import axios from 'axios';
import {
  removeCookieValue,
  getCookieValue,
  getTrustedDeviceToken,
  clearStorage,
} from './utils/token';
import { API_URI, API_BASE_PATH, ROUTES } from './constants';
import { isClient } from './utils/isEnvironment';

const { CancelToken } = axios;

const softExit = () => {
  if (isClient) {
    removeCookieValue('token');
    clearStorage();

    if (Router.router.pathname !== ROUTES.SIGN_IN) {
      Router.push(ROUTES.SIGN_IN);
    }
  }
};

const callApi = axios.create({
  baseURL: `${API_URI || process.env.API_URI}/${API_BASE_PATH ||
    process.env.API_BASE_PATH}`,
  withCredentials: true,
});

callApi.interceptors.request.use(config => {
  const token = getCookieValue('token');
  const fingerprint = getTrustedDeviceToken(false);

  if (token) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (fingerprint) {
    // eslint-disable-next-line no-param-reassign
    config.headers['x-fingerprint'] = fingerprint;
  }

  return config;
});

callApi.interceptors.response.use(
  config => config,
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          if (
            error.response.config.url !== '/auth/2fa' &&
            error.response.config.url !== '/auth/2fa/activate'
          ) {
            softExit();
          }
          break;
        default:
          // console.log(error.response.data);
          break;
      }
    }

    return Promise.reject(error.response);
  },
);

// user
export const getUserSelf = () => callApi.get('/users/self');

export const getUsers = () => callApi.get('/user');

export const postKeys = data => callApi.post('/keys', data);

export const getKeys = () => callApi.get('/keys');

export const updateKey = (email, data) => callApi.post(`/keys/${email}`, data);

export const getQrCode = () => callApi.get('/auth/2fa');

export const getBackupCodes = () => callApi.get('/auth/2fa/backups');

export const postActivateTwoFactor = data =>
  callApi.post('/auth/2fa/activate', data);

export const postCheckTwoFactor = data => callApi.post('/auth/2fa', data);

// post
export const getLists = () => callApi.get('/list');

export const patchListSort = (listId, data) =>
  callApi.patch(`/list/${listId}/sort`, data);

export const getUserBootstrap = () => callApi.get('/user/security/bootstrap');

export const postCreateItem = data => callApi.post('/items', data);

export const postCreateItemsBatch = data => callApi.post('/items/batch', data);

export const removeItem = itemId => callApi.delete(`/items/${itemId}`);

export const removeItemsBatch = query =>
  callApi.delete(`/items/batch?${query}`);

export const updateMoveItem = (itemId, data) =>
  callApi.patch(`/items/${itemId}/move`, data);

export const updateMoveItemsBatch = (data, listId) =>
  callApi.patch(`/items/batch/move/list/${listId}`, data);

export const updateItem = (itemId, data) =>
  callApi.patch(`/items/${itemId}`, data);

// list
export const postCreateList = data => callApi.post('/list', data);

export const patchList = (listId, data) =>
  callApi.patch(`/list/${listId}`, data);

export const removeList = listId => callApi.delete(`/list/${listId}`);

export const toggleFavorite = id => callApi.post(`/items/${id}/favorite`);

export const getPublicKeyByEmailBatch = data =>
  callApi.post('/key/batch', data);

export const postNewUser = data => callApi.post('/user', data);

export const postNewUserBatch = data => callApi.post('/user/batch', data);

export const postLoginPrepare = data =>
  callApi.post('/auth/srpp/login_prepare', data);

export const postLogin = data => callApi.post('/auth/srpp/login', data);

export const postLogout = () => callApi.post('/logout');

export const postRegistration = data =>
  callApi.post('/auth/srpp/registration', data);

export const postChangePassword = data =>
  callApi.patch('/auth/srpp/password', data);

export const getCheckShare = id => callApi.get(`/anonymous/share/${id}/check`);

export const postInvitation = data => callApi.post('/invitation', data);

export const postInvitationBatch = data => callApi.post('/invitations', data);

export const patchResetPassword = (token, data) =>
  callApi.patch(`/auth/srpp/reset/${token}`, data);

export const getSecureMessage = id => callApi.get(`/message/${id}`);
/* VAULT */

export const postCreateVault = payload => callApi.post('/vault', payload);

/* TEAM */
export const getUserTeams = () => callApi.get('/user/teams');

export const getTeams = () => callApi.get('/teams');

export const getUsersByIds = userIds =>
  callApi.get(`/users?${userIds.map(userId => `ids[]=${userId}`).join('&')}`);

export const getTeamMembers = teamId => callApi.get(`/teams/${teamId}/members`);

export const postLeaveTeam = teamId => callApi.post(`/teams/${teamId}/leave`);

// @Deprecated
export const postCreateTeam = data => callApi.post('/teams', data);

export const editTeam = (teamId, data) =>
  callApi.patch(`/teams/${teamId}`, data);

export const deleteTeam = teamId => callApi.delete(`/teams/${teamId}`);

export const getTeam = teamId => callApi.get(`/teams/${teamId}`);

export const updateTeamMember = ({ teamId, userId, role }) =>
  callApi.patch(`/teams/${teamId}/members/${userId}`, {
    userRole: role,
  });

export const deleteTeamMember = ({ teamId, userId }) =>
  callApi.delete(`/teams/${teamId}/members/${userId}`);

export const postAddTeamMember = ({ teamId, userId, role, secret }) =>
  callApi.post(`/teams/${teamId}/members/${userId}`, {
    userRole: role,
    secret,
  });

/*
"members": [
    {
      "userRole": "member",
      "secret": "string",
      "userId": "string"
    }
  ]
*/
export const postAddTeamMemberBatch = ({ teamId, members }) =>
  callApi.post(`/teams/${teamId}/members/batch`, {
    members,
  });

export const getTeamLists = teamId => callApi.get(`/teams/${teamId}/lists`);

export const postCreateTeamList = (teamId, data) =>
  callApi.post(`/teams/${teamId}/lists`, data);

export const patchTeamList = (teamId, listId, data) =>
  callApi.patch(`/teams/${teamId}/lists/${listId}`, data);

export const removeTeamList = (teamId, listId) =>
  callApi.delete(`/teams/${teamId}/lists/${listId}`);

/* COMMON */
let getSearchUserSource;

export const getSearchUser = email => {
  if (getSearchUserSource) getSearchUserSource();

  return callApi.get(`/users/search`, {
    params: { email },
    cancelToken: new CancelToken(function executor(c) {
      // An executor function receives a cancel function as a parameter
      getSearchUserSource = c;
    }),
  });
};

export const getMembers = () => callApi.get('/users');

export const getDefaultTeamMembers = () =>
  callApi.get('/teams/default/members');

export const getMovableLists = () => callApi.get(`/lists/movable`);

export const getUserItems = () => callApi.get('/items/all');
