import { getHostName } from '@caesar/common/utils/getDomainName';

function isValidItem(item) {
  // TODO: strengthen checks
  if (!item.data) {
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

export function generateSystemItemName(entity, id) {
  return `${entity}-${id}`;
}

export function generateSystemItemEmail(entity, id) {
  return `${generateSystemItemName(entity, id)}@${getHostName()}`;
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
