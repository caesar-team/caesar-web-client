import { getHostName } from '@caesar/common/utils/getDomainName';
import { processUploadedFiles } from './attachment';
import { decryptItem } from './cipherUtils';
import { ITEM_TYPE } from '../constants';

function isValidItem(item) {
  // TODO: strengthen checks
  if (!('data' in item)) {
    // eslint-disable-next-line no-console
    console.error(
      `The item with ID: ${item.id} is broken. It doesn't contain the data after decryption.`,
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
export function converSystemItemToKeyPair(item) {
  if (!item.data) return null;
  const { pass } = item.data;
  const itemRaws = item.data?.raws || {
    publicKey: null,
    privateKey: null,
  };

  const { publicKey = null, privateKey = null } = itemRaws;

  return {
    id: item.id,
    password: pass,
    publicKey,
    privateKey,
  };
}

export const decryptItemData = async (item, privateKeyObject) => {
  try {
    const { data: encryptedData, raws: encryptedRaws } = JSON.parse(
      item.secret,
    );
    if (item.type !== ITEM_TYPE.SYSTEM) {
      console.log(`Decrypting ${item.id}`);
      console.log(`encryptedData: ${encryptedData}`);
      console.log(`encryptedRaws: ${encryptedRaws}`);
    }

    const promises = [];
    promises.push(decryptItem(encryptedData, privateKeyObject));

    if (item.type === ITEM_TYPE.SYSTEM) {
      promises.push(decryptItem(encryptedRaws, privateKeyObject));
    }

    const [data, raws = {}] = await Promise.all(promises);
    if (item.type !== ITEM_TYPE.SYSTEM) {
      console.log(`data: %o`, data);
      console.log(`raws: %o`, raws);
    }
    if (!data) {
      return {
        data: null,
      };
    }

    return {
      data: {
        ...data,
        raws,
      },
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Can't decrypt the item ${item.id}, the error is %s`, error);

    return {
      data: null,
    };
  }
};
