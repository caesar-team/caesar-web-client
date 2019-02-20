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

export const generateKeys = async (masterPassword, user) => {
  const options = {
    userIds: [{ name: user }],
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
