import * as yup from 'yup';
import { ERROR } from './constants';
import { checkFileSize, checkAllFileSizes } from './utils';

const STRING_MAX_LENGTH = 100;

const attachmentsSchema = yup
  .array(
    yup.object({
      name: yup.string().required(),
      raw: yup.string().test('fileSize', ERROR.FILE_SIZE(), checkFileSize),
    }),
  )
  .test('fileSizes', ERROR.FILE_SIZES, checkAllFileSizes);

export const SCHEMA = {
  REQUIRED_FIELD: yup.string().required(ERROR.REQUIRED),
  REQUIRED_STRING: yup.string().required(ERROR.REQUIRED_TEXT),
  REQUIRED_LIMITED_STRING: (max = STRING_MAX_LENGTH) =>
    yup
      .string()
      .trim()
      .required(ERROR.REQUIRED_TEXT)
      .max(max, ERROR.MAX_LENGTH(max)),
  LIMITED_STRING: (max = STRING_MAX_LENGTH) =>
    yup
      .string()
      .trim()
      .max(max, ERROR.MAX_LENGTH(max)),
  ATTACHMENTS: attachmentsSchema,
};
