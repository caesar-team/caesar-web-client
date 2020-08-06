import * as yup from 'yup';
import { convertSizeNameToNumber } from '@caesar/common/validation/utils';

import { BASE_64_LENGTH_BYTE_RATE } from '@caesar/common/utils/file';

const MAX_SIZE = '8MB';

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
