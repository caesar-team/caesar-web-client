import * as yup from 'yup';
import zxcvbn from 'zxcvbn';

const GOOD_PASSWORD_SCORE = 3;

const checkIsPasswordValid = value =>
  zxcvbn(value).score >= GOOD_PASSWORD_SCORE;

export const passwordSchema = yup.object().shape({
  password: yup
    .string()
    .test('zxcvbn', 'Too simple password', checkIsPasswordValid)
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

export const checkPasswordSchema = yup.object({
  password: yup.string().required(),
});
