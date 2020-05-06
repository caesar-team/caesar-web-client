import * as yup from 'yup';
import { errorMessages } from '@caesar/common/utils/errorMessages';

export const attachmentsSchema = yup.array(
  yup.object({
    name: yup.string().required(),
    raw: yup.string(),
  }),
);

export const schema = yup.object({
  text: yup
    .string()
    .when('attachments', (attachments, textSchema) =>
      attachments && attachments.length
        ? textSchema
        : textSchema.required(errorMessages.required),
    ),
  password: yup.string(),
  requestsLimit: yup.number().required(),
  secondsLimit: yup.number().required(),
  attachments: attachmentsSchema,
});
