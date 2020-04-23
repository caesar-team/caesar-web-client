import * as yup from 'yup';
import { errorMessages } from 'common/utils/errorMessages';
import { attachmentsSchema } from '../schema/schema';

const URL_REGEXP = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;

export const schema = yup.object({
  name: yup.string().required(errorMessages.required),
  login: yup.string().required(errorMessages.required),
  pass: yup.string().required(errorMessages.required),
  website: yup.string().matches(URL_REGEXP, {
    excludeEmptyString: true,
    message: 'Incorrect format for website',
  }),
  note: yup.string(),
  attachments: attachmentsSchema,
});
