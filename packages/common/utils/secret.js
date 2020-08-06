import {
  extactExtFromFilename,
  getFilenameWithoutExt,
  getRealFileSizeForBase64enc,
} from '@caesar/common/utils/file';
import {
  encryptByPassword,
  decryptByPassword,
} from '@caesar/common/utils/cipherUtils';

export const makeMetaData = secret => {
  let attachments;
  let raw = {};
  if (secret.attachments) {
    raw = secret.attachments.map(attach => attach.raw);
    attachments = secret.attachments.map(attach => {
      return {
        name: getFilenameWithoutExt(attach.name),
        ext: extactExtFromFilename(attach.name),
        size: getRealFileSizeForBase64enc(attach.raw.length),
      };
    });
  }

  return {
    ...secret,
    metadata: {
      attachments,
    },
    attachments: raw,
  };
};

export const addMetaToSecret = secret => makeMetaData(secret);
export const buildSecretMessage = secret => {
  const message = {
    message: {
      text: secret.text,
      metadata: secret.metadata,
    },
    attachments: secret.attachments,
  };

  return message;
};

export const encryptSecret = async (secret, passphrase) => {
  const secretMessage = buildSecretMessage(secret);

  const encryptedMessagePromise = encryptByPassword(
    secretMessage.message,
    passphrase,
  );
  const encryptedAttachmentsPromise = encryptByPassword(
    secretMessage.attachments,
    passphrase,
  );

  const [encryptedMessage, encryptedAttachments] = await Promise.all([
    encryptedMessagePromise,
    encryptedAttachmentsPromise,
  ]);

  return {
    encryptedMessage,
    encryptedAttachments,
  };
};
