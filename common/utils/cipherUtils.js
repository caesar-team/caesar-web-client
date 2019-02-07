import * as openpgp from 'openpgp';

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

export const encryptItemForMembers = async (secret, keys) =>
  Promise.all(
    keys.map(async key => {
      const encrypted = await openpgp.encrypt({
        message: openpgp.message.fromText(JSON.stringify(secret)),
        publicKeys: (await openpgp.key.readArmored(key)).keys,
      });

      return encrypted.data;
    }),
  );
