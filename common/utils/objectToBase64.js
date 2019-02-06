import btoa from 'btoa';

export const objectToBase64 = object => {
  try {
    return typeof window === 'undefined'
      ? btoa(JSON.stringify(object))
      : window.btoa(JSON.stringify(object));
  } catch (ex) {
    return null;
  }
};
