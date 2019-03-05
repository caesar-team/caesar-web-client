import * as yup from 'yup';

export const schema = yup.object().shape({
  title: yup.number().required(),
  login: yup.number().required(),
  password: yup.number().required(),
  website: yup.number().nullable(),
  note: yup.number().nullable(),
});
