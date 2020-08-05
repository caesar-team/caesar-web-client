import {
  MAX_UPLOADING_FILE_SIZE,
  TOTAL_MAX_UPLOADING_FILES_SIZES,
} from '@caesar/common/constants';

export const ERROR = {
  REQUIRED: 'This field is required',
  REQUIRED_TEXT:
    'The field can not be empty. Please enter at least 1 character.',
  MAX_LENGTH: max => `No more than ${max} characters.`,
  FILE_SIZE: (currentSize = 0, maxFileSize = MAX_UPLOADING_FILE_SIZE) =>
    `Maximum file size is ${maxFileSize}, current filesize is ${currentSize}.`,
  FILE_SIZES: `All attachments cannot be over ${TOTAL_MAX_UPLOADING_FILES_SIZES}.`,
  WEBSITE: 'Must be an url.',
  IMAGE_UPLOAD: 'Please upload an image.',
};
