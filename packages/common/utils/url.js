export const parseUrl = url => {
  let prefix = '';

  if (!/^https?:\/\//.test(url)) {
    prefix = 'https://';
  }

  try {
    const urlObject = new URL(prefix + url);

    return urlObject;
  } catch (error) {
    return {};
  }
};

export const getOriginDomain = url => {
  const parsedUrl = parseUrl(url);

  return parsedUrl.hostname;
};
