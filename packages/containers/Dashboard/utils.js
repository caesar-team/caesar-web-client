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

const searchFn = (obj, pattern) => fieldName =>
  obj &&
  pattern &&
  obj[fieldName] &&
  obj[fieldName].toLowerCase().includes(pattern.toLowerCase());

const SECRET_SEARCH_FIELDS = ['name', 'note', 'website'];

export const filter = memoize((data, pattern) =>
  pattern
    ? data.filter(({ data: itemsData }) =>
        SECRET_SEARCH_FIELDS.some(searchFn(itemsData, pattern)),
      )
    : data,
);
