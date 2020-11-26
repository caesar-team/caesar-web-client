import * as yup from 'yup';

export const schema = yup.object().shape({
  name: yup.number().required(),
  login: yup.number().nullable(),
  password: yup.number().nullable(),
  website: yup.number().nullable(),
  note: yup.number().nullable(),
});
