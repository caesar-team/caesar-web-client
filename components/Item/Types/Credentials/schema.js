import * as yup from 'yup';

export const schema = yup.object({
  name: yup.string().required(),
  login: yup.string().required(),
  pass: yup
    .string()
    .required('The field can not be empty. Please enter at least 1 character.'),
  website: yup
    .string()
    .matches(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/,
      { excludeEmptyString: true },
    ),
  note: yup.string(),
  attachments: yup.array(yup.mixed()),
});
