import * as yup from 'yup';

export const schema = yup.object().shape({
  files: yup.array(
    yup.object({
      name: yup.string().required(),
      raw: yup.string().required(),
    }),
  ),
});
