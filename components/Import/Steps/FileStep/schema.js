import * as yup from 'yup';

const isValidImage = file =>
  Reflect.has(file, 'id') && Reflect.has(file, 'path');

const FILE_SCHEMA = yup.mixed().test('file', 'not a file', isValidImage);

export const schema = yup.object({
  files: yup.array(FILE_SCHEMA),
});
