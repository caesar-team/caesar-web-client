import { ITEM_TYPE } from '@caesar/common/constants';

export const getInitialValues = (type, listId) => {
  switch (type) {
    case ITEM_TYPE.CREDENTIALS:
      return {
        type,
        listId,
        title: '',
        login: '',
        pass: '',
        website: '',
        note: '',
        attachments: [],
      };
    case ITEM_TYPE.DOCUMENT:
      return {
        type,
        listId,
        title: '',
        note: '',
        attachments: [],
      };
    default:
      return {};
  }
};
