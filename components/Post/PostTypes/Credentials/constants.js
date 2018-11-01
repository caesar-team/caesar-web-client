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
  website: [
    {
      type: 'string',
      pattern: /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/,
      message: 'The field has invalid value',
    },
  ],
};
