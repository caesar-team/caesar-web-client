import { getHostName } from '@caesar/common/utils/getDomainName';
import { generateKeys } from '@caesar/common/utils/key';
import { passwordGenerator } from '@caesar/common/utils/passwordGenerator';
import { ITEM_TYPE } from '@caesar/common/constants';

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
  return `${generateSystemItemName(entity, id)}@${getHostName()}.com`;
}

export function extractKeysFromSystemItem(item) {
  const publicKey = item.attachments?.find(({ name }) => name === 'publicKey')?.raw;
  const privateKey = item.attachments?.find(({ name }) => name === 'privateKey')?.raw;

  return {
    publicKey,
    privateKey,
  };
}

export function generateSystemItem(entity, listId, entityId) {
  const masterPassword = passwordGenerator();
  const systemItemEmail = generateSystemItemEmail(entity, entityId);

  const {
    publicKey,
    privateKey,
  } = generateKeys(masterPassword, [systemItemEmail]);

  const systemItemData = {
    type: ITEM_TYPE.SYSTEM,
    listId,
    attachments: [
      {
        name: 'publicKey',
        raw: publicKey,
      },
      {
        name: 'privateKey',
        raw: privateKey,
      },
    ],
    pass: masterPassword,
    name: generateSystemItemName(entity, entityId),
  };

  return systemItemData;
}
