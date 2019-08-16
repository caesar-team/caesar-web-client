import * as openpgp from 'openpgp';
import btoa from 'btoa';
import atob from 'atob';
import { generateKeys } from 'common/utils/key';
import { generator } from 'common/utils/password';
import { randomId } from 'common/utils/uuid4';
import { createSrp } from './srp';

const srp = createSrp();

export const getPrivateKeyObj = async (privateKey, password) => {
  const privateKeyObj = (await openpgp.key.readArmored(privateKey)).keys[0];
  await privateKeyObj.decrypt(password);

  return privateKeyObj;
};

export const decryptItem = async (secretArmored, privateKeyObj) => {
  const secret = await openpgp.message.readArmored(secretArmored);
  const { data } = await openpgp.decrypt({
    message: secret,
    privateKeys: [privateKeyObj],
  });

  return JSON.parse(data);
};

export const encryptItem = async (secret, key) => {
  const encrypted = await openpgp.encrypt({
    message: openpgp.message.fromText(JSON.stringify(secret)),
    publicKeys: (await openpgp.key.readArmored(key)).keys,
  });

  return encrypted.data;
};

export const encryptItemsBatch = async (secrets, key) => {
  return Promise.all(
    secrets.map(async secret => await encryptItem(secret, key)),
  );
};

export const encryptByPassword = async (secret, password) => {
  const encrypted = await openpgp.encrypt({
    message: openpgp.message.fromText(JSON.stringify(secret)),
    passwords: [password],
  });

  return encrypted.data;
};

export const decryptByPassword = async (secretArmored, password) => {
  const secret = await openpgp.message.readArmored(secretArmored);
  const { data } = await openpgp.decrypt({
    message: secret,
    passwords: [password],
  });

  return JSON.parse(data);
};

export const encryptItemForUsers = async (secret, keys) =>
  Promise.all(keys.map(async key => await encryptItem(secret, key)));

export const generateUser = async email => {
  const masterPassword = generator();
  const password = generator();

  const keys = await generateKeys(masterPassword, [email]);

  return { email, password, masterPassword, ...keys };
};

export const generateUsersBatch = async emails => {
  const masterPassword = generator();
  const password = generator();

  const keys = await generateKeys(masterPassword, emails);

  return emails.map(email => ({
    email,
    password,
    masterPassword,
    ...keys,
  }));
};

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

export const generateSeedAndVerifier = (email, password) => {
  const seed = srp.getRandomSeed();
  const verifier = srp.generateV(srp.generateX(seed, email, password));

  return {
    seed,
    verifier,
  };
};
