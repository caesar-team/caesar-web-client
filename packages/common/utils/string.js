import { DEFAULT_LIST_TYPES_ARRAY } from '@caesar/common/constants';

export function upperFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(str, length, ending = '...') {
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  }

  return str;
}

export const newLineToHtml = string => string.replace(/\n/g, '<br/>');

export function textSize(text) {
  return new TextEncoder('utf-8').encode(text).length;
}

export const getPlural = (counter, [single, plural]) =>
  counter === 1 ? single : plural;

export const transformListTitle = title =>
  DEFAULT_LIST_TYPES_ARRAY.includes(title) ? upperFirst(title) : title;

const LESS_THAN = '&#60;';
const GREATER_THAN = '&#62;';

export const unescapeHTML = escapedHTML => {
  return escapedHTML.replace(/LESS_THAN/g, '<').replace(/GREATER_THAN/g, '>');
};

export const escapeHTML = unescapedHTML => {
  return unescapedHTML.replace(/</g, LESS_THAN).replace(/>/g, GREATER_THAN);
};
