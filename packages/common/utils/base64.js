// import btoa from 'btoa';
// import atob from 'atob';

export const objectToBase64 = object => {
  try {
    const encodedString = unescape(encodeURIComponent(JSON.stringify(object)));

    return Buffer.from(encodedString).toString('base64');
    // return typeof window === 'undefined'
    //   ? btoa(encodedString)
    //   : window.btoa(encodedString);
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.error(ex);

    return object;
  }
};

export const base64ToObject = b64 => {
  try {
    return JSON.parse(
      decodeURIComponent(escape(Buffer.from(b64, 'base64').toString())),
    );
    // return typeof window === 'undefined';
    // ? JSON.parse(decodeURIComponent(escape(atob(b64))))
    // : JSON.parse(decodeURIComponent(escape(window.atob(b64))));
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.error(ex);

    return b64;
  }
};
