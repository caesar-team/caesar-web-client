import * as yup from 'yup';
import { errorMessages } from 'common/utils/errorMessages';

export const schema = yup.object({
  name: yup.string().required(errorMessages.required),
  login: yup.string().required(errorMessages.required),
  pass: yup.string().required(errorMessages.required),
  website: yup
    .string()
    .matches(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/,
      { excludeEmptyString: true },
    ),
  note: yup.string(),
  attachments: yup.array(yup.mixed()),
});
