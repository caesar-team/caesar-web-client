function isValidItem(item) {
  // TODO: strengthen checks
  if (!item.data) {
    console.error(
      `The item with ID: ${item.id} is broken. It doesn't contain item credentials after decryption.`,
    );

    return false;
  }

  return true;
}

export function checkItemsAfterDecryption(items) {
  return items.reduce(
    (accumulator, item) =>
      isValidItem(item) ? [...accumulator, item] : accumulator,
    [],
  );
}

export function generateSystemItemName(teamName) {
  return `team+${encodeURIComponent(teamName.toLowerCase())}`;
}

export function generateSystemItemEmail(teamName) {
  return `${generateSystemItemName(teamName)}@${location.hostname}`;
}

export function extractKeysFromSystemItem(item) {
  const publicKey = item.attachments?.find(({ name }) => name === 'publicKey')?.raw;
  const privateKey = item.attachments?.find(({ name }) => name === 'privateKey')?.raw;

  return {
    publicKey,
    privateKey,
  };
}
