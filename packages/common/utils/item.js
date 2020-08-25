import { getHostName } from '@caesar/common/utils/getDomainName';
import { processUploadedFiles } from './attachment';

function isValidItem(item) {
  // TODO: strengthen checks
  if (!item.data) {
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
  const itemAttachments = item?.attachments || item.data?.attachments;
  if (!itemAttachments) return item;

  return {
    ...item,
    ...processUploadedFiles(itemAttachments),
  };
};

export function generateSystemItemName(teamId) {
  return `team-${teamId}`;
}

export function generateSystemItemEmail(teamId) {
  return `${generateSystemItemName(teamId)}@${getHostName()}`;
}

export function extractKeysFromSystemItem(item) {
  const publicKey = item.attachments?.find(({ name }) => name === 'publicKey')
    ?.raw;
  const privateKey = item.attachments?.find(({ name }) => name === 'privateKey')
    ?.raw;

  return {
    publicKey,
    privateKey,
  };
}
