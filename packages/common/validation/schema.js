import * as yup from 'yup';
import { ERROR } from './constants';
import { checkFileSize, checkAllFileSizes } from './utils';

export const attachmentsSchema = yup
  .array(
    yup.object({
      name: yup.string().required(),
      raw: yup.string().test('fileSize', ERROR.FILE_SIZE, checkFileSize),
    }),
  )
  .test('fileSizes', ERROR.FILE_SIZES, checkAllFileSizes);
