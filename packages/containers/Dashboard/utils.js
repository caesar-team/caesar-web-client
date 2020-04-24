import { match } from '@caesar/common/utils/match';
import {
  ITEM_CREDENTIALS_TYPE,
  ITEM_DOCUMENT_TYPE,
} from '@caesar/common/constants';

export const initialCredentials = listId => ({
  listId,
  type: ITEM_CREDENTIALS_TYPE,
  invited: [],
  owner: true,
  data: {
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
  data: {
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
