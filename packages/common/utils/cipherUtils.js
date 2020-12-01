import * as openpgp from 'openpgp';
import { generateKeys } from './key';
import { getHostName } from './getDomainName';
import { randomId } from './uuid4';
import { objectToBase64, base64ToObject } from './base64';
import { createSrp } from './srp';
import { passwordGenerator } from './passwordGenerator';

const srp = createSrp();

export const unsealPrivateKeyObj = async (privateKey, password) => {
  try {
    const privateKeyObj = (await openpgp.key.readArmored(privateKey)).keys[0];
    await privateKeyObj.decrypt(password);

    return privateKeyObj;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    return null;
  }
};

export const testDecryptSecretArmored = async (
  secretArmored,
  privateKeyObj,
) => {
  try {
    await openpgp.decrypt({
      message: await openpgp.message.readArmored(secretArmored),
      privateKeys: [privateKeyObj],
    });

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('decryption error %s', error);

    return false;
  }
};

export const decryptData = async (secretArmored, privateKeyObj) => {
  try {
    const secret = await openpgp.message.readArmored(secretArmored);
    const { data } = await openpgp.decrypt({
      message: secret,
      privateKeys: [privateKeyObj],
    });

    return base64ToObject(data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('decryption error %s', error);

    return null;
  }
};

export const encryptData = async (data, key) => {
  const encrypted = await openpgp.encrypt({
    message: openpgp.message.fromBinary(
      openpgp.util.str_to_Uint8Array(objectToBase64(data)),
    ),
    publicKeys: (await openpgp.key.readArmored(key)).keys,
  });

  return encrypted.data;
};

export const encryptDataBatch = async (dataSet, key) => {
  // eslint-disable-next-line
  return Promise.all(dataSet.map(async data => await encryptData(data, key)));
};

export const encryptByPassword = async (data, password) => {
  const encrypted = await openpgp.encrypt({
    message: openpgp.message.fromBinary(
      openpgp.util.str_to_Uint8Array(objectToBase64(data)),
    ),
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

  return base64ToObject(data);
};

export const generateUser = async email => {
  const masterPassword = passwordGenerator();
  const password = passwordGenerator();

  const keys = await generateKeys(masterPassword, [email]);

  return { email, password, masterPassword, ...keys };
};

export const generateUsersBatch = async emails => {
  const masterPassword = passwordGenerator();
  const password = passwordGenerator();

  const keys = await generateKeys(masterPassword, emails);

  return emails.map(email => ({
    email,
    password,
    masterPassword,
    ...keys,
  }));
};

export const generateAnonymousEmail = () =>
  `anonymous_${randomId()}@${getHostName()}`;

export const generateSeedAndVerifier = (email, password) => {
  const seed = srp.getRandomSeed();
  const verifier = srp.generateV(srp.generateX(seed, email, password));

  return {
    seed,
    verifier,
  };
};
