import { LIST_TYPES_ARRAY } from '@caesar/common/constants';

export function upperFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(str, length, ending = '...') {
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  }

  return str;
}

export function textSize(text) {
  return new TextEncoder('utf-8').encode(text).length;
}

export const getPlural = (counter, [single, plural]) =>
  counter === 1 ? single : plural;

export const transformListTitle = title =>
  LIST_TYPES_ARRAY.includes(title) ? upperFirst(title) : title;
