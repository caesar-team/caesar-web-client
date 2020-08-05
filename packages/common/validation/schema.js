import * as yup from 'yup';
import { ERROR } from './constants';
import {
  checkFileSize,
  checkAllFileSizes,
  getSizesForFile,
  humanizeSize,
} from './utils';

const STRING_MAX_LENGTH = 100;
const WEBSITE_MAX_LENGTH = 2048;

const attachmentsSchema = yup
  .array(
    yup.object({
      name: yup.string().required(),
      raw: yup
        .string()
        .test(
          'fileSize',
          file => ERROR.FILE_SIZE(humanizeSize(getSizesForFile(file), true)),
          checkFileSize,
        ),
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
  WEBSITE: yup
    .string()
    .url(ERROR.WEBSITE)
    .max(WEBSITE_MAX_LENGTH, ERROR.MAX_LENGTH(WEBSITE_MAX_LENGTH)),
  ATTACHMENTS: attachmentsSchema,
};
