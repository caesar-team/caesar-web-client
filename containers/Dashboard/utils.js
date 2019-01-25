import { uuid4 } from 'common/utils/uuid4';
import { match } from 'common/utils/match';
import { base64toFile, fileToBase64 } from 'common/utils/file';
import { ITEM_CREDENTIALS_TYPE, ITEM_DOCUMENT_TYPE } from 'common/constants';

export const prepareFiles = attachments =>
  attachments.map(({ name: attachmentName, raw }) => {
    const file = base64toFile(raw, attachmentName);
    const uid = uuid4();

    file.uid = uid;

    const {
      lastModified,
      lastModifiedDate,
      name,
      size,
      type,
      webkitRelativePath,
    } = file;

    return {
      uid,
      lastModified,
      lastModifiedDate,
      name,
      size,
      type,
      webkitRelativePath,
      originFileObj: file,
    };
  });

export const prepareAttachments = files => {
  if (!files.length) return Promise.resolve([]);

  const originalFiles = files.map(
    file => (file.originFileObj ? file.originFileObj : file),
  );

  return Promise.all(originalFiles.map(fileToBase64)).then(preparedFiles =>
    preparedFiles.map((preparedFile, index) => ({
      name: files[index].name,
      raw: preparedFile,
    })),
  );
};

export const initialCredentials = listId => ({
  listId,
  type: ITEM_CREDENTIALS_TYPE,
  invited: [],
  owner: true,
  secret: {
    name: '',
    login: '',
    pass: '',
    website: '',
    note: '',
    attachments: [],
  },
});

export const initialDocument = listId => ({
  listId,
  type: ITEM_DOCUMENT_TYPE,
  invited: [],
  owner: true,
  secret: {
    name: '',
    note: '',
    attachments: [],
  },
});

export const initialItemData = (type, listId) =>
  match(
    type,
    {
      [ITEM_CREDENTIALS_TYPE]: initialCredentials(listId),
      [ITEM_DOCUMENT_TYPE]: initialDocument(listId),
    },
    {},
  );
