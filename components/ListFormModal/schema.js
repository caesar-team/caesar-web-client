import * as yup from 'yup';

export const schema = yup.object({
  label: yup.string().required(),
});
