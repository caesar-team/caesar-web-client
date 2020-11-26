import {
  MAX_UPLOADING_FILE_SIZE,
  TOTAL_MAX_UPLOADING_FILES_SIZES,
} from '@caesar/common/constants';

import {
  getRealFileSizesForBase64enc,
  BASE_64_LENGTH_BYTE_RATE,
} from '@caesar/common/utils/file';

export const SIZE_NAME_RATE_MAP = {
  B: 1,
  KB: 1024,
  MB: 1024 * 1024,
};

export const convertSizeNameToNumber = sizeName =>
  sizeName.replace(/(\d+)(B|KB|MB)/, (match, size, type) =>
    size && type ? Number(size) * SIZE_NAME_RATE_MAP[type] : 0,
  );

export const checkFileSize = raw =>
  (typeof raw === 'number' ? raw : raw.length) * BASE_64_LENGTH_BYTE_RATE <=
  convertSizeNameToNumber(MAX_UPLOADING_FILE_SIZE);

export const checkAllFileSizes = files =>
  files
    ? getRealFileSizesForBase64enc(files) <=
      convertSizeNameToNumber(TOTAL_MAX_UPLOADING_FILES_SIZES)
    : true;

export const humanizeSize = (bytes, si = true, dp = 1) => {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`;
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;

  let formatedBytes = bytes;
  do {
    formatedBytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(formatedBytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return `${formatedBytes.toFixed(dp)} ${units[u]}`;
};
