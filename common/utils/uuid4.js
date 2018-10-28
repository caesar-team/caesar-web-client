export function uuid4() {
  let uuid = '';
  let ii;

  for (ii = 0; ii < 32; ii += 1) {
    switch (ii) {
      case 8:
      case 20:
        uuid += '-';
        // eslint-disable-next-line no-bitwise
        uuid += ((Math.random() * 16) | 0).toString(16);
        break;
      case 12:
        uuid += '-';
        uuid += '4';
        break;
      case 16:
        uuid += '-';
        // eslint-disable-next-line no-bitwise
        uuid += ((Math.random() * 4) | 8).toString(16);
        break;
      default:
        // eslint-disable-next-line no-bitwise
        uuid += ((Math.random() * 16) | 0).toString(16);
    }
  }

  return uuid;
}
