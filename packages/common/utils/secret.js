import {
  extactExtFromFilename,
  getFilenameWithoutExt,
  getRealFileSizeForBase64enc,
} from '@caesar/common/utils/file';
import {
  encryptByPassword,
  decryptByPassword,
} from '@caesar/common/utils/cipherUtils';

export const cleanMessageBeforeEncode = message => message.trim();

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
      text: encodeURIComponent(cleanMessageBeforeEncode(secret.text)),
      attachments,
    },
    raws,
  };
};

export const getDecodedSecret = secret => {
  return {
    ...secret,
    text: decodeURIComponent(secret.text),
  };
};
export const getEncryptedRawsFromSecret = secret =>
  JSON.parse(secret).encryptedRaws;

export const decryptSecretMessage = (secret, passphrase) => {
  return decryptByPassword(JSON.parse(secret).encryptedMessage, passphrase);
};

export const decryptSecretRaws = (secret, passphrase) => {
  return decryptByPassword(JSON.parse(secret).encryptedRaws, passphrase);
};

export const encryptSecret = async (secret, passphrase) => {
  const secretMessage = buildSecretMessage(secret);
  const encryptedMessagePromise = encryptByPassword(
    secretMessage.message,
    passphrase,
  );
  const encryptedRawsPromise = encryptByPassword(
    secretMessage.raws,
    passphrase,
  );

  const [encryptedMessage, encryptedRaws] = await Promise.all([
    encryptedMessagePromise,
    encryptedRawsPromise,
  ]);

  return {
    encryptedMessage: await encryptedMessage,
    encryptedRaws: await encryptedRaws,
  };
};
