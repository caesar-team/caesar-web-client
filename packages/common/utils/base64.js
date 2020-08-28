export const objectToBase64 = object => {
  try {
    return Buffer.from(
      unescape(encodeURIComponent(JSON.stringify(object))),
    ).toString('base64');
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
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.error(ex);

    return b64;
  }
};
