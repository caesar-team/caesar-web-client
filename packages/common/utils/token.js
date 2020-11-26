import Cookies from 'js-cookie';
import Fingerprint2 from 'fingerprintjs2';
import { FINGERPRINT } from '@caesar/common/constants';
import { isServer } from './isEnvironment';

export function setCookieValue(name, value, path = '/') {
  return Cookies.set(name, value, { path });
}

export function getCookieValue(name, path = '/') {
  return Cookies.get(name, { path });
}

export function removeCookieValue(name, path = '/') {
  return Cookies.remove(name, path);
}

const generateFingerPrint = () => {
  let token = '';

  if (window.requestIdleCallback) {
    return new Promise(resolve =>
      requestIdleCallback(() => {
        Fingerprint2.get(components => {
          const values = components.map(component => component.value);
          token = Fingerprint2.x64hash128(values.join(''), 99);
          resolve(token);
        });
      }),
    );
  }

  return new Promise(resolve =>
    setTimeout(() => {
      Fingerprint2.get(components => {
        const values = components.map(component => component.value);
        token = Fingerprint2.x64hash128(values.join(''), 99);
        resolve(token);
      });
    }, 500),
  );
};

export const getTrustedDeviceToken = generate => {
  if (isServer) return null;

  const token = window.localStorage.getItem(FINGERPRINT);

  if (!token && generate) {
    return new Promise(resolve => {
      generateFingerPrint().then(data => {
        window.localStorage.setItem(FINGERPRINT, data);
        resolve(data);
      });
    });
  }

  return token;
};

export const removeTrustedDevice = () => {
  if (isServer) return null;

  return window.localStorage.removeItem(FINGERPRINT);
};

export const clearStorage = () => {
  return window.localStorage ? window.localStorage.clear() : false;
};
