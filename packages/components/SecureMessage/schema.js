import * as yup from 'yup';
import { SCHEMA, MAX_ITEM_NOTE_LENGTH } from '@caesar/common/validation';

export const schema = yup.object({
  text: SCHEMA.LIMITED_STRING(MAX_ITEM_NOTE_LENGTH),
  password: yup.string(),
  requestsLimit: yup.number().required(),
  secondsLimit: yup.number().required(),
  attachments: SCHEMA.ARRAY_OF_ATTACHMENTS,
});
