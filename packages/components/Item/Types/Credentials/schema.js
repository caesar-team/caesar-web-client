import * as yup from 'yup';
import { ERROR } from '@caesar/common/validation/constants';
import { attachmentsSchema } from '@caesar/common/validation/schema';

const URL_REGEXP = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;

export const schema = yup.object({
  name: yup.string().required(ERROR.REQUIRED_TEXT),
  login: yup.string().required(ERROR.REQUIRED_TEXT),
  pass: yup.string().required(ERROR.REQUIRED_TEXT),
  website: yup.string().matches(URL_REGEXP, {
    excludeEmptyString: true,
    message: 'Incorrect format for website',
  }),
  note: yup.string(),
  attachments: attachmentsSchema,
});
