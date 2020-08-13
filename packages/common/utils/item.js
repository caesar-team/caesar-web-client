function isValidItem(item) {
  // TODO: strengthen checks
  if (!item.data) {
    // eslint-disable-next-line no-console
    console.error(
      `The item with ID: ${item.id} is broken. It doesn't contain item credentials after decryption.`,
    );

    return false;
  }

  return true;
}

export const escapeObjectValues = item =>
  Object.fromEntries(
    Object.entries(item).map(([key, value]) =>
      typeof value === 'string' ? [key, encodeURIComponent(value)] : value,
    ),
  );

export const unEscapeObjectValues = item =>
  Object.fromEntries(
    Object.entries(item).map(([key, value]) =>
      typeof value === 'string' ? [key, decodeURIComponent(value)] : value,
    ),
  );

export function checkItemsAfterDecryption(items) {
  return items.reduce(
    (accumulator, item) =>
      isValidItem(item) ? [...accumulator, item] : accumulator,
    [],
  );
}

export const buildSecretItem = item => {
  const { data } = item;

  return {
    ...item,
  };
};
