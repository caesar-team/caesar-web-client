import btoa from 'btoa';
import atob from 'atob';

export const objectToBase64 = object => {
  try {
    return typeof window === 'undefined'
      ? btoa(JSON.stringify(object))
      : window.btoa(JSON.stringify(object));
  } catch (ex) {
    return null;
  }
};

export const base64ToObject = b64 => {
  try {
    return typeof window === 'undefined'
      ? JSON.parse(atob(b64))
      : JSON.parse(window.atob(b64));
  } catch (ex) {
    return null;
  }
};
