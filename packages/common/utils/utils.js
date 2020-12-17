export function pick(object, keys) {
  return keys.reduce(
    (obj, key) => (object[key] ? { ...obj, [key]: object[key] } : obj),
    {},
  );
}

export const get = (obj, path, defaultValue) => {
  const result = String.prototype.split
    .call(path, /[,[\].]+?/)
    .filter(Boolean)
    .reduce(
      (res, key) => (res !== null && res !== undefined ? res[key] : res),
      obj,
    );

  return result === undefined || result === obj ? defaultValue : result;
};

export const waitIdle = () => {
  if (window.requestIdleCallback) {
    return new Promise(requestIdleCallback);
  }

  return new Promise(setTimeout);
};

export const chunk = (input, size) => {
  return input.reduce((arr, item, idx) => {
    return idx % size === 0
      ? [...arr, [item]]
      : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]];
  }, []);
};

export const objectToArray = obj => Object.values(obj);

export const arrayToObject = (arr, id = 'id') =>
  arr.reduce((accumulator, item) => ({ ...accumulator, [item[id]]: item }), {});

export const match = (inboundItems, outboundItems, idField = 'id') => {
  if (Object.keys(inboundItems).length === 0) return [];
  const results = outboundItems.filter(outboundItem =>
    inboundItems[outboundItem[idField]] ? outboundItem[idField] : null,
  );

  return results;
};

export const sortByName = (a, b) => {
  const nameA = a.toLowerCase();
  const nameB = b.toLowerCase();

  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  return 0;
};

export const isIterable = obj => (obj ? Symbol.iterator in Object(obj) : false);
