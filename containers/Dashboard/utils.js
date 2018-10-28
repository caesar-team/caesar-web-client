import { uuid4 } from 'common/utils/uuid4';
import { match } from 'common/utils/match';
import { base64toFile, fileToBase64 } from 'common/utils/file';
import { POST_CREDENTIALS_TYPE } from 'common/constants';

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

  const originalFiles = files.map(({ originFileObj }) => originFileObj);

  return Promise.all(originalFiles.map(fileToBase64)).then(preparedFiles =>
    preparedFiles.map((preparedFile, index) => ({
      name: originalFiles[index].name,
      raw: preparedFile,
    })),
  );
};

export const initialCredentials = listId => ({
  listId,
  type: POST_CREDENTIALS_TYPE,
  shared: [],
  owner: true,
  secret: {
    name: '',
    login: '',
    pass: '',
    note: '',
    attachments: [],
  },
});

export const initialPostData = (type, listId) =>
  match(
    type,
    {
      [POST_CREDENTIALS_TYPE]: initialCredentials(listId),
    },
    {},
  );
