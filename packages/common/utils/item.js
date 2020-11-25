import { getHostName } from '@caesar/common/utils/getDomainName';
import { processUploadedFiles } from './attachment';
import { decryptData } from './cipherUtils';
import { ITEM_TYPE, DOMAIN_HOSTNAME } from '../constants';

export const extractItemType = item => item?.type || ITEM_TYPE.SYSTEM;

export const isSystemItem = item => extractItemType(item) === ITEM_TYPE.SYSTEM;
export const isKeyPairItem = item =>
  extractItemType(item) === ITEM_TYPE.KEYPAIR;
export const isGeneralItem = item =>
  extractItemType(item) !== ITEM_TYPE.SYSTEM &&
  extractItemType(item) !== ITEM_TYPE.KEYPAIR;
export const isDecryptedItem = item => !!item?.data;

export const isValidItem = item => {
  // TODO: strengthen checks
  if (!item.data) {
    // eslint-disable-next-line no-console
    console.error(
      `The item with ID: ${item.id} is broken. It doesn't contain the data after decryption.`,
    );

    return false;
  }

  return true;
};

export const checkItemsAfterDecryption = items => {
  return (
    items?.reduce(
      (accumulator, item) =>
        isValidItem(item) ? [...accumulator, item] : accumulator,
      [],
    ) || items
  );
};

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

export const generateSystemItemName = (entity, id) => {
  return `${entity}-${id}`;
};

export const generateSystemItemEmail = entityName => {
  return `systems+${entityName}@${DOMAIN_HOSTNAME || getHostName()}`;
};

export const extractKeysFromSystemItem = item => {
  const itemRaws = item.data?.raws || {
    publicKey: null,
    privateKey: null,
  };

  const { publicKey = null, privateKey = null } = itemRaws;

  return {
    publicKey,
    privateKey,
  };
};

export const convertSystemItemToKeyPair = item => {
  if (!item.data) return null;
  const { password } = item.data;
  const itemRaws = item.data?.raws || {
    publicKey: null,
    privateKey: null,
  };

  const { publicKey = null, privateKey = null } = itemRaws;

  return {
    id: item.id,
    password,
    publicKey,
    privateKey,
  };
};
const rawArrayToObject = arr =>
  arr.reduce(
    (accumulator, rawObject) => ({
      ...accumulator,
      [rawObject.id]: rawObject.raw,
    }),
    {},
  );

const dectyptAttachment = async (rawObject, privateKeyObject) => {
  return {
    id: rawObject.id,
    raw: await decryptData(rawObject.raw, privateKeyObject),
  };
};
export const dectyptItemAttachments = async (raws, privateKeyObject) => {
  if (raws) {
    const rawsPromise = Object.keys(raws).map(async key =>
      dectyptAttachment(raws[key], privateKeyObject),
    );
    const rawsArray = await Promise.all(rawsPromise);

    return rawArrayToObject(rawsArray);
  }

  return {};
};
export const decryptItemData = async (item, privateKeyObject) => {
  try {
    const { data: encryptedData, raws: encryptedRaws = {} } = JSON.parse(
      item.secret,
    );
    const promises = [];
    promises.push(decryptData(encryptedData, privateKeyObject));

    if (!isGeneralItem(item))
      // Decrypt keypairs or system items
      promises.push(
        dectyptItemAttachments(JSON.parse(encryptedRaws), privateKeyObject),
      );

    const [data, raws = {}] = await Promise.all(promises);

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

export const createItemMetaData = ({
  data: { attachments = [], website = null, name = null } = {
    attachments: [],
    website: null,
    title: null,
  },
}) => {
  return {
    attachmentsCount: attachments?.length || 0,
    website,
    title: name,
  };
};

export const getItemMetaData = ({
  meta: { attachmentsCount = 0, website = null, title } = {
    attachmentsCount: 0,
    website: null,
    title: null,
  },
}) => {
  return {
    attachmentsCount,
    website,
    title,
  };
};
