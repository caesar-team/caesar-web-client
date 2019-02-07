const DEFAULT_LENGTH = 10;
const CHARS =
  'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890!@#$%&=';

const position = (start, end) =>
  start + Math.floor(Math.random() * (end - start));

export const generatePassword = (length = DEFAULT_LENGTH) =>
  Array.from({ length }, (_, key) => CHARS[position(key, CHARS.length)]).join(
    '',
  );
