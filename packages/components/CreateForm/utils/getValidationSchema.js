import * as yup from 'yup';
import { ITEM_TYPE } from '@caesar/common/constants';
import { SCHEMA, ERROR } from '@caesar/common/validation';

const WEBSITE_MAX_LENGTH = 2048;
const WEBSITE_ERROR_TEXT = 'Must be an url';

export const getValidationSchema = type => {
  switch (type) {
    case ITEM_TYPE.CREDENTIALS:
      return yup.object({
        listId: SCHEMA.REQUIRED_FIELD,
        name: SCHEMA.REQUIRED_LIMITED_STRING(),
        login: SCHEMA.REQUIRED_LIMITED_STRING(),
        pass: SCHEMA.REQUIRED_LIMITED_STRING(),
        website: yup
          .string()
          .url(WEBSITE_ERROR_TEXT)
          .max(WEBSITE_MAX_LENGTH, ERROR.MAX_LENGTH(WEBSITE_MAX_LENGTH)),
        note: yup.string(),
        attachments: SCHEMA.ATTACHMENTS,
      });
    case ITEM_TYPE.DOCUMENT:
      return yup.object({
        listId: SCHEMA.REQUIRED_FIELD,
        name: SCHEMA.REQUIRED_LIMITED_STRING(),
        note: yup.string(),
        attachments: SCHEMA.ATTACHMENTS,
      });
    default:
      return {};
  }
};
