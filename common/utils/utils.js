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
