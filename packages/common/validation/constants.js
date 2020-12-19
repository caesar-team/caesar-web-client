import {
  MAX_UPLOADING_FILE_SIZE,
  TOTAL_MAX_UPLOADING_FILES_SIZES,
} from '@caesar/common/constants';
import { REGEXP_TEXT_MATCH } from '@caesar/containers/Bootstrap/constants';

export const ERROR = {
  REQUIRED: 'This field is required',
  REQUIRED_TEXT:
    'The field can not be empty. Please enter at least 1 character',
  MAX_LENGTH: max => `Maximum ${max} characters`,
  FILE_SIZE: (currentSize = 0, maxFileSize = MAX_UPLOADING_FILE_SIZE) =>
    `Must be less than ${maxFileSize}`,
  ALL_FILES_SIZE: (
    currentSize = 0,
    maxAllFilesSize = TOTAL_MAX_UPLOADING_FILES_SIZES,
  ) =>
    `All attachments must be less than ${maxAllFilesSize}. Please, delete some attachments`,
  WEBSITE: 'Must be an url',
  IMAGE_UPLOAD: 'Please, upload an image',
  LIST_ALREADY_EXISTS: 'List with such label already exists',
  INCORRECT_CREDENTIALS: 'Incorrect credentials',
};

export const GOOD_PASSWORD_RULES = [
  ...REGEXP_TEXT_MATCH,
  {
    text: 'Unique password (i.e. do not use qwerty)',
    regexp: 'zxcvbn',
  },
];

export const MAX_PASSWORD_LENGTH = 24;
export const MAX_TEAM_TITLE_LENGTH = 40;
export const MAX_TEAM_AVATAR_SIZE = '8MB';
