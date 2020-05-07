import * as yup from 'yup';
import {
  MAX_UPLOADING_FILE_SIZE,
  TOTAL_MAX_UPLOADING_FILES_SIZES,
} from '@caesar/common/constants';

const BASE_64_LENGTH_BYTE_RATE = 3 / 4;
const SIZE_NAME_RATE_MAP = {
  B: 1,
  KB: 1024,
  M: 1024 * 1024,
};

const convertSizeNameToNumber = sizeName =>
  sizeName.replace(/(\d+)(B|KB|M)/, (match, size, type) =>
    size && type ? Number(size) * SIZE_NAME_RATE_MAP[type] : 0,
  );

const checkFileSize = raw =>
  raw.length * BASE_64_LENGTH_BYTE_RATE <=
  convertSizeNameToNumber(MAX_UPLOADING_FILE_SIZE);

const checkAllFileSizes = files =>
  files
    ? files.reduce((acc, { raw }) => acc + raw.length, 0) *
        BASE_64_LENGTH_BYTE_RATE <=
      convertSizeNameToNumber(TOTAL_MAX_UPLOADING_FILES_SIZES)
    : true;

export const attachmentsSchema = yup
  .array(
    yup.object({
      name: yup.string().required(),
      raw: yup.string().test('fileSize', 'File is too large.', checkFileSize),
    }),
  )
  .test('fileSizes', 'Files are too large.', checkAllFileSizes);
