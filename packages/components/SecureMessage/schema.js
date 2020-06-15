import * as yup from 'yup';
import { attachmentsSchema } from '@caesar/common/validation/schema';

export const schema = yup.object({
  text: yup.string(),
  password: yup.string(),
  requestsLimit: yup.number().required(),
  secondsLimit: yup.number().required(),
  attachments: attachmentsSchema,
});
