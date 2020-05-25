import * as yup from 'yup';

const MAX_SIZE = '8M';
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
  raw &&
  raw.length * BASE_64_LENGTH_BYTE_RATE <= convertSizeNameToNumber(MAX_SIZE);

export const schema = yup.object({
  title: yup.string().required(),
  icon: yup.object({
    name: yup.string().required(),
    raw: yup
      .string()
      .test('fileSize', `Maximum file size is ${MAX_SIZE}`, checkFileSize),
  }),
});
