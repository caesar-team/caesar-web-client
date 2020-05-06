function callOrReturn(value) {
  return typeof value === 'function' ? value() : value;
}

export function match(target, variants = {}, def = null) {
  return callOrReturn(
    Object.prototype.hasOwnProperty.call(variants, target)
      ? variants[target]
      : def,
  );
}

export function matchStrict(target, variants, def) {
  if (typeof variants !== 'object') throw new Error('Variants must be object');
  if (typeof def === 'undefined')
    throw new Error('Default value cannot be undefined');

  return Object.prototype.hasOwnProperty.call(variants, target)
    ? variants[target]
    : def;
}
