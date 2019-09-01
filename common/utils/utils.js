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

export const waitIdle = () => new Promise(requestIdleCallback);

export const chunk = (input, size) => {
  return input.reduce((arr, item, idx) => {
    return idx % size === 0
      ? [...arr, [item]]
      : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]];
  }, []);
};

export const objectToArray = obj => Object.values(obj);

export const arrayToObject = arr =>
  arr.reduce((accumulator, item) => ({ ...accumulator, [item.id]: item }), {});
