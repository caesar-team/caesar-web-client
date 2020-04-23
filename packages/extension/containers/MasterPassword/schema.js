import * as yup from 'yup';

const REGEXP_AT_LEAST_ONE_SPECIAL_CHARACTER = /[-/\\^$*+?!@#%&.()|[\]{}]/;
const REGEXP_AT_LEAST_ONE_NUMBER = /[0-9]/;
const REGEXP_MINIMUM_LENGTH = /.{8,}/;

const REGEXP_TEXT_MATCH = [
  {
    text: '1 special character',
    regexp: REGEXP_AT_LEAST_ONE_SPECIAL_CHARACTER,
  },
  { text: '1 number', regexp: REGEXP_AT_LEAST_ONE_NUMBER },
  { text: '8 characters minimum', regexp: REGEXP_MINIMUM_LENGTH },
];

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
      .test('rules', 'Wrong password', value =>
        password ? value === password : checkIsPasswordValid(value),
      )
      .required(),
  });

export const checkPasswordSchema = yup.object({
  password: yup.string().required(),
});
