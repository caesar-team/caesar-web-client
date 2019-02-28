export const TWO_FACTOR_SKIP = 'TWO_FACTOR_SKIP';
export const TWO_FACTOR_CHECK = 'TWO_FACTOR_CHECK';
export const TWO_FACTOR_CREATE = 'TWO_FACTOR_CREATE';
export const TWO_FACTOR_BACKUPS = 'TWO_FACTOR_BACKUPS';

export const PASSWORD_SKIP = 'PASSWORD_SKIP';
export const PASSWORD_CHANGE = 'PASSWORD_CHANGE';

export const MASTER_PASSWORD_CREATE = 'MASTER_PASSWORD_CREATE';
export const MASTER_PASSWORD_CONFIRM = 'MASTER_PASSWORD_CONFIRM';
export const MASTER_PASSWORD_CHECK = 'MASTER_PASSWORD_CHECK';

export const BOOTSTRAP_FINISH = 'BOOTSTRAP_FINISH';

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
