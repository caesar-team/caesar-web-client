import * as yup from 'yup';
import { REGEXP_TEXT_MATCH } from '../Bootstrap/constants';

const checkIsPasswordValid = value =>
  value && REGEXP_TEXT_MATCH.every(({ regexp }) => regexp.test(value));

export const schema = yup.object({
  email: yup
    .string()
    .email()
    .required('Email is required field'),
  password: yup
    .string()
    .required('Password is required field')
    .test('rules', 'Too simple password', checkIsPasswordValid),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Confirm Password is required field'),
});
