import * as openpgp from 'openpgp';
import btoa from 'btoa';
import atob from 'atob';
import { generateKeys } from 'common/utils/key';
import { generatePassword } from 'common/utils/password';
import { randomId } from 'common/utils/uuid4';

export const encryptText = async (text, password) => {
  const { data: message } = await openpgp.encrypt({
    message: openpgp.message.fromText(password),
    passwords: password,
  });

  return message;
};

export const decryptText = async (message, password) => {
  const decryptedSessionKeys = await openpgp.decryptSessionKeys({
    message: await openpgp.message.readArmored(message),
    passwords: password,
  });

  const decrypted = await openpgp.decrypt({
    sessionKeys: decryptedSessionKeys[0],
    message: await openpgp.message.readArmored(message),
  });

  return decrypted.data;
};

export const encryptItemForUser = async (secret, key) => {
  const encrypted = await openpgp.encrypt({
    message: openpgp.message.fromText(JSON.stringify(secret)),
    publicKeys: (await openpgp.key.readArmored(key)).keys,
  });

  return encrypted.data;
};

export const encryptItemForUsers = async (secret, keys) =>
  Promise.all(keys.map(async key => await encryptItemForUser(secret, key)));

export const generateUser = async email => {
  const masterPassword = generatePassword();
  const password = generatePassword();

  const keys = await generateKeys(masterPassword, email);

  return { email, password, masterPassword, ...keys };
};

export const generateUsers = async emails =>
  Promise.all(emails.map(async email => await generateUser(email)));

export const generateAnonymousEmail = () =>
  `anonymous_${randomId()}@caesar.team`;

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
