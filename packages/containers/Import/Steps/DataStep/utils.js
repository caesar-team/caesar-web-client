import memoize from 'memoize-one';
import { SEARCH_FIELDS } from './constants';

export const capitalize = string => {
  if (typeof string !== 'string') return '';

  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const normalize = array =>
  array.reduce(
    (accumulator, curr, index) => ({ ...accumulator, [index]: curr }),
    {},
  );

export const denormalize = object => Object.values(object);

export const filter = memoize((data, pattern) =>
  data.filter(row =>
    SEARCH_FIELDS.some(field => row[field].toLowerCase().includes(pattern)),
  ),
);
