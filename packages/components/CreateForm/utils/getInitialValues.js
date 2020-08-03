import { ITEM_TYPE } from '@caesar/common/constants';

export const getInitialValues = (type, teamId, listId) => {
  switch (type) {
    case ITEM_TYPE.CREDENTIALS:
      return {
        type,
        teamId,
        listId,
        name: '',
        login: '',
        pass: '',
        website: '',
        note: '',
        attachments: [],
      };
    case ITEM_TYPE.DOCUMENT:
      return {
        type,
        teamId,
        listId,
        name: '',
        note: '',
        attachments: [],
      };
    default:
      return {};
  }
};
