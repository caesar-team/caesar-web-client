export const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const getEncryption = link => link.match(/\/([\w|+-]+)$/)[1];
export const getShareId = link => link.match(/share\/(.+)\//)[1];
export const getAnonymousLink = shared => shared.link || null;
