import * as yup from 'yup';
import { errorMessages } from 'common/utils/errorMessages';
import { attachmentsSchema } from '../schema/schema';

export const schema = yup.object({
  name: yup.string().required(errorMessages.required),
  note: yup.string(),
  attachments: attachmentsSchema,
});
