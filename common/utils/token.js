import Cookies from 'js-cookie';

export function setToken(token) {
  return Cookies.set('token', token, { path: '/' });
}

export function getToken() {
  return Cookies.get('token', { path: '/' });
}

export function removeToken() {
  return Cookies.remove('token', { path: '/' });
}
