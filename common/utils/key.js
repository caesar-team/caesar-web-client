import * as openpgp from 'openpgp';
import { uuid4 } from './uuid4';
import { LENGTH_KEY } from '../constants';

export const generateKeys = async password => {
  const options = {
    userIds: [{ name: uuid4() }],
    numBits: LENGTH_KEY,
    passphrase: password,
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
