import * as yup from 'yup';

export const createSchema = fileExt =>
  yup.object().shape({
    file: yup
      .object({
        ext: yup
          .string()
          .test('isExt', `Only *.${fileExt} files can be uploaded`, ext => {
            return new RegExp(`${fileExt}$`).test(ext);
          }),
        raw: yup.string(),
      })
      .required(),
  });
