import { getHostName } from '@caesar/common/utils/getDomainName';
import { processUploadedFiles } from './attachment';

function isValidItem(item) {
  // TODO: strengthen checks
  if (!('data' in item)) {
    // eslint-disable-next-line no-console
    console.error(
      `The item with ID: ${item.id} is broken. It doesn't contain item credentials after decryption.`,
    );

    return false;
  }

  return true;
}

export function checkItemsAfterDecryption(items) {
  return items.reduce(
    (accumulator, item) =>
      isValidItem(item) ? [...accumulator, item] : accumulator,
    [],
  );
}

export const splitItemAttachments = item => {
  const itemAttachments = item.data?.attachments;
  if (!itemAttachments) return item;

  return {
    ...item,
    data: {
      ...item.data,
      ...processUploadedFiles(itemAttachments),
    },
  };
};

export function generateSystemItemName(entity, id) {
  return `${entity}-${id}`;
}

export function generateSystemItemEmail(entity, id) {
  return `${generateSystemItemName(entity, id)}@${getHostName()}.com`;
}

export function extractKeysFromSystemItem(item) {
  const itemAttachments = item.data?.attachments;
  const itemRaws = item.data?.raws;
  if (!itemAttachments || !itemRaws) {
    return {
      publicKey: null,
      privateKey: null,
    };
  }
  const publicKeyIndex = itemAttachments?.findIndex(
    ({ name }) => name === 'publicKey',
  )?.raw;
  const privateKeyIndex = itemAttachments?.findIndex(
    ({ name }) => name === 'privateKey',
  )?.raw;
  const publicKey = itemRaws[publicKeyIndex];
  const privateKey = itemRaws[privateKeyIndex];

  return {
    publicKey,
    privateKey,
  };
}
