import {
  MAX_UPLOADING_FILE_SIZE,
  TOTAL_MAX_UPLOADING_FILES_SIZES,
} from '@caesar/common/constants';

export const ERROR = {
  REQUIRED: 'The field can not be empty. Please enter at least 1 character',
  FILE_SIZE: `Maximum file size is ${MAX_UPLOADING_FILE_SIZE}`,
  FILE_SIZES: `All attachments cannot be over ${TOTAL_MAX_UPLOADING_FILES_SIZES}`,
};
