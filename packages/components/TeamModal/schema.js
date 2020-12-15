import * as yup from 'yup';
import { checkFileSize } from '@caesar/common/utils/file';
import { SCHEMA } from '@caesar/common/validation/schema';
import { MAX_TEAM_TITLE_LENGTH } from '@caesar/common/validation/constants';

const MAX_SIZE = '8MB';

export const getValidationSchema = existedTeams => {
  return yup.object({
    title: SCHEMA
      .REQUIRED_LIMITED_STRING(MAX_TEAM_TITLE_LENGTH)
      .notOneOf(existedTeams, 'You already have a team with the same name'),
    icon: yup.object({
      raw: yup
        .string()
        .test('fileSize', `Maximum file size is ${MAX_SIZE}`, raw =>
          !raw?.length ? false : checkFileSize(raw.length, MAX_SIZE),
        ),
    }),
  })
};
