import * as yup from 'yup';
import zxcvbn from 'zxcvbn';
import { GOOD_PASSWORD_SCORE } from '@caesar/common/constants';
import { MAX_PASSWORD_LENGTH } from '@caesar/common/validation/constants';

const checkIsPasswordValid = value =>
  value && zxcvbn(value).score >= GOOD_PASSWORD_SCORE;

export const passwordSchema = yup.object().shape({
  password: yup
    .string()
    .test('zxcvbn', 'Too simple password', checkIsPasswordValid)
    .max(MAX_PASSWORD_LENGTH, `Maximum ${MAX_PASSWORD_LENGTH} characters`)
    .required(),
});

export const createConfirmPasswordSchema = password =>
  yup.object({
    confirmPassword: yup
      .string()
      .test('zxcvbn', 'Wrong password', value =>
        password ? value === password : checkIsPasswordValid(value),
      )
      .required(),
  });
