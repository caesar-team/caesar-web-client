import {
  MAX_UPLOADING_FILE_SIZE,
  TOTAL_MAX_UPLOADING_FILES_SIZES,
} from '@caesar/common/constants';

export const BASE_64_LENGTH_BYTE_RATE = 3 / 4;
export const SIZE_NAME_RATE_MAP = {
  B: 1,
  KB: 1024,
  M: 1024 * 1024,
};

export const convertSizeNameToNumber = sizeName =>
  sizeName.replace(/(\d+)(B|KB|M)/, (match, size, type) =>
    size && type ? Number(size) * SIZE_NAME_RATE_MAP[type] : 0,
  );

export const checkFileSize = raw =>
  raw.length * BASE_64_LENGTH_BYTE_RATE <=
  convertSizeNameToNumber(MAX_UPLOADING_FILE_SIZE);

export const checkAllFileSizes = files =>
  files
    ? files.reduce((acc, { raw }) => acc + raw.length, 0) *
        BASE_64_LENGTH_BYTE_RATE <=
      convertSizeNameToNumber(TOTAL_MAX_UPLOADING_FILES_SIZES)
    : true;
