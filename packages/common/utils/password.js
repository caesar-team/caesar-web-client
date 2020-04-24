import { pick } from './utils';

const DIGITS = '1234567890';
const SPECIALS = '!@#$%^&*()+-,.{}<>_:~=';
const LOWER_CASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPER_CASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const MAP = {
  digits: DIGITS,
  specials: SPECIALS,
  lowercase: LOWER_CASE,
  uppercase: UPPER_CASE,
};

const DEFAULT_OPTIONS = {
  digits: true,
  specials: true,
  lowercase: true,
  uppercase: true,
};

const DEFAULT_LENGTH = 8;

// Fisher-Yates shuffle
function shuffle(array) {
  let counter = array.length;

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);

    counter--;

    const temp = array[counter];

    // eslint-disable-next-line
    array[counter] = array[index];
    // eslint-disable-next-line
    array[index] = temp;
  }

  return array;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function split(number, delimiter) {
  const chunks = [];
  const remainder = number % delimiter;
  const quotient = Math.floor(number / delimiter);

  for (let i = 0; i < delimiter - 1; i++) {
    chunks.push(
      random(random(1, quotient - remainder), quotient + remainder - 1),
    );
  }

  return shuffle(
    chunks.concat(number - chunks.reduce((acc, value) => acc + value, 0)),
  );
}

export function generator(length = DEFAULT_LENGTH, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const keys = Object.keys(opts).filter(key => !!opts[key]);

  const delimiter = keys.length;
  const symbols = Object.values(pick(MAP, keys));

  return shuffle(
    split(length, delimiter).reduce((accumulator, number, index) => {
      const chars = symbols[index];
      const variants = Array.from(
        { length: number },
        () => chars[random(0, chars.length - 1)],
      );

      return [...accumulator, ...variants];
    }, []),
  ).join('');
}
