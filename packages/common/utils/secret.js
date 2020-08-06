import {
  extactExtFromFilename,
  getFilenameWithoutExt,
  getRealFileSizeForBase64enc,
} from '@caesar/common/utils/file';
import {
  encryptByPassword,
  decryptByPassword,
} from '@caesar/common/utils/cipherUtils';

export const buildSecretMessage = secret => {
  let attachments;
  let raws = [];
  if (secret.attachments) {
    raws = secret.attachments.map(attach => attach.raw);
    attachments = secret.attachments.map(attach => {
      return {
        name: getFilenameWithoutExt(attach.name),
        ext: extactExtFromFilename(attach.name),
        size: getRealFileSizeForBase64enc(attach.raw.length),
      };
    });
  }

  return {
    message: {
      text: secret.text,
      attachments,
    },
    raws,
  };
};

export const decryptSecretMessage = (secret, passphrase) => {
  return decryptByPassword(
    (typeof secret === 'string' ? JSON.parse(secret) : secret).encryptedMessage,
    passphrase,
  );
};

export const decryptSecretRaws = (secret, passphrase) => {
  return decryptByPassword(
    (typeof secret === 'string' ? JSON.parse(secret) : secret).encryptedRaws,
    passphrase,
  );
};

export const encryptSecret = async (secret, passphrase) => {
  const secretMessage = buildSecretMessage(secret);

  const encryptedMessagePromise = encryptByPassword(
    JSON.stringify(secretMessage.message),
    passphrase,
  );
  const encryptedRawsPromise = encryptByPassword(
    JSON.stringify(secretMessage.raws),
    passphrase,
  );

  const [encryptedMessage, encryptedRaws] = await Promise.all([
    encryptedMessagePromise,
    encryptedRawsPromise,
  ]);

  return {
    encryptedMessage,
    encryptedRaws,
  };
};
