const defaultRule = [
  {
    required: true,
    message: 'The field can not be empty. Please enter at least 1 character.',
  },
];

export const rules = {
  name: defaultRule,
  login: defaultRule,
  pass: defaultRule,
};
