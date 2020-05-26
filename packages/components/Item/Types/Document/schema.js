import * as yup from 'yup';
import { ERROR } from '@caesar/common/validation/constants';
import { attachmentsSchema } from '@caesar/common/validation/schema';

export const schema = yup.object({
  name: yup.string().required(ERROR.REQUIRED),
  note: yup.string(),
  attachments: attachmentsSchema,
});
