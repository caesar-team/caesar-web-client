import * as yup from 'yup';
import { ERROR } from '@caesar/common/validation/constants';
import { attachmentsSchema } from '@caesar/common/validation/schema';

export const schema = yup.object({
  text: yup
    .string()
    .when('attachments', (attachments, textSchema) =>
      attachments && attachments.length
        ? textSchema
        : textSchema.required(ERROR.REQUIRED),
    ),
  password: yup.string(),
  requestsLimit: yup.number().required(),
  secondsLimit: yup.number().required(),
  attachments: attachmentsSchema,
});
