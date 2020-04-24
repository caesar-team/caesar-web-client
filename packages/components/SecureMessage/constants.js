export const SECURE_MESSAGE_FORM_STEP = 'SECURE_MESSAGE_FORM_STEP';
export const SECURE_MESSAGE_LINK_STEP = 'SECURE_MESSAGE_LINK_STEP';

export const ONE_SIXTH_HOUR = 600;
export const ONE_HOUR = 129600;
export const HALF_DAY = 43200;
export const DAY = 86400;

export const initialValues = {
  text: '',
  password: '',
  attachments: [],
  secondsLimit: ONE_HOUR,
  requestsLimit: -1,
};

export const requestsLimitOptions = [
  { value: -1, label: 'No limit' },
  { value: 1, label: 'One time' },
  { value: 10, label: 'Ten times' },
  { value: 50, label: 'Fifty times' },
];

export const secondsLimitOptions = [
  { value: ONE_SIXTH_HOUR, label: '10 min' },
  { value: ONE_HOUR, label: '1 hour' },
  { value: HALF_DAY, label: '12 hours' },
  { value: DAY, label: '1 day' },
];
