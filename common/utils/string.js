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
