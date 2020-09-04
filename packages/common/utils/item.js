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

export function generateSystemItemEmail(entityName) {
  return `teams+${entityName}@${getHostName()}.com`;
}

export function extractKeysFromSystemItem(item) {
  const itemRaws = item.data?.raws || {
    publicKey: null,
    privateKey: null,
  };

  const { publicKey = null, privateKey = null } = itemRaws;

  return {
    publicKey,
    privateKey,
  };
}
