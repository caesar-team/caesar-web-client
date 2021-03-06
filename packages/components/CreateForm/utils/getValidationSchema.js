import * as yup from 'yup';
import { ITEM_TYPE } from '@caesar/common/constants';
import { SCHEMA, MAX_ITEM_NOTE_LENGTH } from '@caesar/common/validation';

export const getValidationSchema = type => {
  switch (type) {
    case ITEM_TYPE.CREDENTIALS:
      return yup.object({
        listId: SCHEMA.REQUIRED_FIELD,
        name: SCHEMA.REQUIRED_LIMITED_STRING(),
        login: SCHEMA.REQUIRED_LIMITED_STRING(),
        password: SCHEMA.REQUIRED_LIMITED_STRING(),
        website: SCHEMA.WEBSITE,
        note: SCHEMA.LIMITED_STRING(MAX_ITEM_NOTE_LENGTH),
        attachments: SCHEMA.ARRAY_OF_ATTACHMENTS,
        raws: SCHEMA.RAWS,
      });
    case ITEM_TYPE.DOCUMENT:
      return yup.object({
        listId: SCHEMA.REQUIRED_FIELD,
        name: SCHEMA.REQUIRED_LIMITED_STRING(),
        note: SCHEMA.LIMITED_STRING(MAX_ITEM_NOTE_LENGTH),
        attachments: SCHEMA.ARRAY_OF_ATTACHMENTS,
        raws: SCHEMA.RAWS,
      });
    default:
      return {};
  }
};
