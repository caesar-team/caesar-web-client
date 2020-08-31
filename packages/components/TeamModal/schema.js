import * as yup from 'yup';
import { checkFileSize } from '@caesar/common/validation/utils';
import { SCHEMA } from '@caesar/common/validation/schema';

const MAX_SIZE = '8MB';

export const schema = yup.object({
  title: SCHEMA.REQUIRED_FIELD,
  icon: yup.object({
    raw: yup
      .string()
      .test('fileSize', `Maximum file size is ${MAX_SIZE}`, checkFileSize),
  }),
});
