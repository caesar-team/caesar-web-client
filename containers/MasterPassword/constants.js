const REGEXP_AT_LEAST_ONE_SPECIAL_CHARACTER = /[-/\\^$*+?!@#%&.()|[\]{}]/;
const REGEXP_AT_LEAST_ONE_NUMBER = /[0-9]/;
const REGEXP_MINIMUM_LENGTH = /.{8,}/;

export const REGEXP_TEXT_MATCH = [
  {
    text: '1 special character',
    regexp: REGEXP_AT_LEAST_ONE_SPECIAL_CHARACTER,
  },
  { text: '1 number', regexp: REGEXP_AT_LEAST_ONE_NUMBER },
  { text: '8 character minimum', regexp: REGEXP_MINIMUM_LENGTH },
];

export const STEP_CREATE_MASTER_PASSWORD = 'STEP_CREATE_MASTER_PASSWORD';
export const STEP_CONFIRM_MASTER_PASSWORD = 'STEP_CONFIRM_MASTER_PASSWORD';
