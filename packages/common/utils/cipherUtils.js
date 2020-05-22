import * as openpgp from 'openpgp';
import { generateKeys } from '@caesar/common/utils/key';
import { generator } from '@caesar/common/utils/password';
import { randomId } from '@caesar/common/utils/uuid4';
import { createSrp } from './srp';

const srp = createSrp();

export const getPrivateKeyObj = async (privateKey, password) => {
  const privateKeyObj = (await openpgp.key.readArmored(privateKey)).keys[0];
  await privateKeyObj.decrypt(password);

  return privateKeyObj;
};

export const decryptItem = async (secretArmored, privateKeyObj) => {
  try {
    const secret = await openpgp.message.readArmored(secretArmored);
    const { data } = await openpgp.decrypt({
      message: secret,
      privateKeys: [privateKeyObj],
    });

    return JSON.parse(data);
  } catch (error) {
    console.log('decryption error', error);
    return null;
  }
};

export const encryptItem = async (data, key) => {
  const encrypted = await openpgp.encrypt({
    message: openpgp.message.fromText(JSON.stringify(data)),
    publicKeys: (await openpgp.key.readArmored(key)).keys,
  });

  return encrypted.data;
};

export const encryptItemsBatch = async (dataSet, key) => {
  // eslint-disable-next-line
  return Promise.all(dataSet.map(async data => await encryptItem(data, key)));
};

export const encryptByPassword = async (data, password) => {
  const encrypted = await openpgp.encrypt({
    message: openpgp.message.fromText(JSON.stringify(data)),
    passwords: [password],
  });

  return encrypted.data;
};

export const decryptByPassword = async (secretArmored, password) => {
  const secret = await openpgp.message.readArmored(secretArmored);
  // TODO: Delete this console
  console.log('secret: ', secret);

  const { data } = await openpgp.decrypt({
    message: secret,
    passwords: [password],
  });

  // TODO: Delete this console
  console.log('data: ', data);

  return JSON.parse(data);
};

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

export const generateSeedAndVerifier = (email, password) => {
  const seed = srp.getRandomSeed();
  const verifier = srp.generateV(srp.generateX(seed, email, password));

  return {
    seed,
    verifier,
  };
};
