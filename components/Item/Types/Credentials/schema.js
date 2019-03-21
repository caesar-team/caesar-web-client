import * as yup from 'yup';
import { errorMessages } from 'common/utils/errorMessages';
import {
  MAX_UPLOADING_FILE_SIZE,
  MAX_UPLOADING_FILE_SIZES,
} from 'common/constants';

const URL_REGEXP = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;
const BASE_64_LENGTH_BYTE_RATE = 3 / 4;

const checkFileSize = raw =>
  raw.length * BASE_64_LENGTH_BYTE_RATE <= MAX_UPLOADING_FILE_SIZE;

const checkAllFileSizes = files =>
  files.reduce((acc, { raw }) => acc + raw.length, 0) *
    BASE_64_LENGTH_BYTE_RATE <=
  MAX_UPLOADING_FILE_SIZES;

export const schema = yup.object({
  name: yup.string().required(errorMessages.required),
  login: yup.string().required(errorMessages.required),
  pass: yup.string().required(errorMessages.required),
  website: yup.string().matches(URL_REGEXP, {
    excludeEmptyString: true,
    message: 'Incorrect format for website',
  }),
  note: yup.string(),
  attachments: yup
    .array(
      yup.object({
        name: yup.string().required(),
        raw: yup.string().test('fileSize', 'File is too large.', checkFileSize),
      }),
    )
    .test('fileSizes', 'Files are too large.', checkAllFileSizes),
});
