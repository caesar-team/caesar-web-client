export const checkError = (touched, errors, name) =>
  touched[name] && errors[name] ? errors[name] : null;
