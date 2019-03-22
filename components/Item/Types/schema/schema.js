import * as yup from 'yup';
import {
  MAX_UPLOADING_FILE_SIZE,
  TOTAL_MAX_UPLOADING_FILES_SIZES,
} from 'common/constants';

const BASE_64_LENGTH_BYTE_RATE = 3 / 4;

const checkFileSize = raw =>
  raw.length * BASE_64_LENGTH_BYTE_RATE <= MAX_UPLOADING_FILE_SIZE;

const checkAllFileSizes = files =>
  files.reduce((acc, { raw }) => acc + raw.length, 0) *
    BASE_64_LENGTH_BYTE_RATE <=
  Number(TOTAL_MAX_UPLOADING_FILES_SIZES);

export const attachmentsSchema = yup
  .array(
    yup.object({
      name: yup.string().required(),
      raw: yup.string().test('fileSize', 'File is too large.', checkFileSize),
    }),
  )
  .test('fileSizes', 'Files are too large.', checkAllFileSizes);
