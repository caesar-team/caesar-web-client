import * as yup from 'yup';

export const codeSchema = yup.object().shape({
  code: yup.number().required(),
});
