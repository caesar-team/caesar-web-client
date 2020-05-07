import * as yup from 'yup';
import { errorMessages } from '@caesar/common/utils/errorMessages';
import { attachmentsSchema } from '../schema/schema';

export const schema = yup.object({
  name: yup.string().required(errorMessages.required),
  note: yup.string(),
  attachments: attachmentsSchema,
});
