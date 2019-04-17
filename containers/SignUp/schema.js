import * as yup from 'yup';
import { REGEXP_TEXT_MATCH } from '../Bootstrap/constants';

const checkIsPasswordValid = value =>
  REGEXP_TEXT_MATCH.every(({ regexp }) => regexp.test(value));

export const schema = yup.object({
  email: yup
    .string()
    .email()
    .required(),
  password: yup
    .string()
    .test('rules', 'Too simple password', checkIsPasswordValid)
    .required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required(),
});
