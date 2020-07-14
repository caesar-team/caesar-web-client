import * as yup from 'yup';
import { SCHEMA, ERROR } from '@caesar/common/validation';

export const schema = yup.object({
  name: yup.string().required(ERROR.REQUIRED_TEXT),
  note: yup.string(),
  attachments: SCHEMA.ATTACHMENTS,
});
