import * as yup from 'yup';

export const createSchema = ext =>
  yup.object().shape({
    file: yup
      .object({
        name: yup
          .string()
          .test('isExt', `Only *.${ext} files can be uploaded`, value =>
            new RegExp(`.${ext}$`).test(value),
          ),
        raw: yup.string(),
      })
      .required(),
  });
