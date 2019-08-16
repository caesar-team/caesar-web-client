import * as openpgp from 'openpgp';
import { LENGTH_KEY } from '../constants';

export const reencryptPrivateKey = async (
  oldPassword,
  newPassword,
  encryptedPrivateKey,
) => {
  const privateKeyObj = (await openpgp.key.readArmored(encryptedPrivateKey))
    .keys[0];

  await privateKeyObj.decrypt(oldPassword);
  await privateKeyObj.encrypt(newPassword);

  return privateKeyObj.armor();
};

export const generateKeys = async (masterPassword, emails) => {
  const options = {
    userIds: emails.map(email => ({ email, name: email })),
    numBits: LENGTH_KEY,
    passphrase: masterPassword,
  };

  const { publicKeyArmored, privateKeyArmored } = await openpgp.generateKey(
    options,
  );

  return {
    publicKey: publicKeyArmored,
    privateKey: privateKeyArmored,
  };
};

export const validateKeys = async (password, encryptedPrivateKey) => {
  const privateKeyObj = (await openpgp.key.readArmored(encryptedPrivateKey))
    .keys[0];

  await privateKeyObj.decrypt(password);
};
