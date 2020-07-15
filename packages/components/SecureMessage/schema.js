import * as yup from 'yup';
import { SCHEMA } from '@caesar/common/validation';

export const schema = yup.object({
  text: yup.string(),
  password: yup.string(),
  requestsLimit: yup.number().required(),
  secondsLimit: yup.number().required(),
  attachments: SCHEMA.ATTACHMENTS,
});
