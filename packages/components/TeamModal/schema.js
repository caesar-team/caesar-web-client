import * as yup from 'yup';
import { checkFileSize } from '@caesar/common/validation/utils';
import { SCHEMA, ERROR } from '@caesar/common/validation';
import {
  MAX_TEAM_TITLE_LENGTH,
  MAX_TEAM_AVATAR_SIZE,
} from '@caesar/common/validation/constants';

export const getValidationSchema = existedTeams => {
  return yup.object({
    title: SCHEMA.REQUIRED_LIMITED_STRING(MAX_TEAM_TITLE_LENGTH).notOneOf(
      existedTeams,
      'You already have a team with the same name',
    ),
    icon: yup
      .string()
      .required('Please, upload the image')
      .nullable()
      .test('fileExt', ERROR.IMAGE_UPLOAD, raw =>
        !raw ? false : raw.includes('image/'),
      )
      .test('fileSize', `Maximum file size is ${MAX_TEAM_AVATAR_SIZE}`, raw =>
        !raw ? false : checkFileSize(raw, MAX_TEAM_AVATAR_SIZE),
      ),
  });
};
