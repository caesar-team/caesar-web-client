import * as yup from 'yup';

export const schema = yup.object().shape({
  name: yup.number().required(),
  login: yup.number().required(),
  pass: yup.number().required(),
  website: yup.number().nullable(),
  note: yup.number().nullable(),
});
