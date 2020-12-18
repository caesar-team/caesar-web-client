import {
  MAX_UPLOADING_FILE_SIZE,
  TOTAL_MAX_UPLOADING_FILES_SIZES,
} from '@caesar/common/constants';
import {
  getRealFileSizeForBase64enc,
  getRealFileSizesForBase64enc,
  convertSizeNameToNumber,
} from '@caesar/common/utils/file';

export const checkFileSize = (raw, maxSize = MAX_UPLOADING_FILE_SIZE) =>
  getRealFileSizeForBase64enc(raw.length) <= convertSizeNameToNumber(maxSize);

export const checkAllFileSizes = (
  files,
  totalMaxSize = TOTAL_MAX_UPLOADING_FILES_SIZES,
) =>
  files
    ? getRealFileSizesForBase64enc(files) <=
      convertSizeNameToNumber(totalMaxSize)
    : true;
