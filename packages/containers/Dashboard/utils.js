import memoize from 'memoize-one';
import { match } from '@caesar/common/utils/match';
import { ITEM_TYPE } from '@caesar/common/constants';

export const initialCredentials = listId => ({
  listId,
  type: ITEM_TYPE.CREDENTIALS,
  invited: [],
  owner: true,
  data: {
    name: '',
    login: '',
    password: '',
    website: '',
    note: '',
    attachments: [],
  },
});

export const initialDocument = listId => ({
  listId,
  type: ITEM_TYPE.DOCUMENT,
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
      [ITEM_TYPE.CREDENTIALS]: initialCredentials(listId),
      [ITEM_TYPE.DOCUMENT]: initialDocument(listId),
    },
    {},
  );

const searchFn = (obj, pattern) =>
  obj && pattern && obj.toLowerCase().includes(pattern.toLowerCase());

export const filter = memoize((data, pattern) =>
  pattern ? data.filter(({ title }) => searchFn(title, pattern)) : data,
);
