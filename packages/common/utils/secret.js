import {} from './file';
import { extractRawFromAttachment } from './attachment';
import { encryptByPassword, decryptByPassword } from './cipherUtils';

export const cleanMessageBeforeEncode = message => message.trim();

export const buildSecretMessage = ({ attachments: files, text }) => {
  const { raws = {}, attachments = [] } = extractRawFromAttachment(files);

  return {
    message: {
      text: cleanMessageBeforeEncode(text),
      attachments,
    },
    raws,
  };
};

export const getDecodedSecret = secret => {
  return {
    ...secret,
    text: secret.text,
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
  const { message, raws = {} } = buildSecretMessage(secret);

  const encryptedMessagePromise = encryptByPassword(message, passphrase);
  const encryptedRawsPromise = encryptByPassword(raws, passphrase);

  const [encryptedMessage, encryptedRaws] = await Promise.all([
    encryptedMessagePromise,
    encryptedRawsPromise,
  ]);

  return {
    encryptedMessage: await encryptedMessage,
    encryptedRaws: await encryptedRaws,
  };
};
