import * as yup from 'yup';

export const schema = yup.object({
  messagePassword: yup.string().required(),
});
