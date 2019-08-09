export function pick(object, keys) {
  return keys.reduce(
    (obj, key) => (object[key] ? { ...obj, [key]: object[key] } : obj),
    {},
  );
}
