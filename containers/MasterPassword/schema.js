import * as yup from 'yup';
import { REGEXP_TEXT_MATCH } from './constants';

const checkIsPasswordValid = value =>
  REGEXP_TEXT_MATCH.every(({ regexp }) => regexp.test(value));

export const passwordSchema = yup.object().shape({
  password: yup
    .string()
    .test('rules', 'Too simple password', checkIsPasswordValid)
    .required(),
});

export const createConfirmPasswordSchema = password =>
  yup.object({
    confirmPassword: yup
      .string()
      .test(
        'rules',
        'Wrong password',
        value => (password ? value === password : checkIsPasswordValid(value)),
      )
      .required(),
  });

export const checkPasswordSchema = yup.object({
  checkPassword: yup.string().required(),
});
