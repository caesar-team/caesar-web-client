const DEFAULT_OPTIONS = {
  symbols: {
    digits: '1234567890',
    specials: '!@#$%^&*()+-{}<>_:=',
    lowerCase: 'abcdefghijklmnopqrstuvwxyz',
    upperCase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  },
  digits: true,
  specials: true,
  lowerCase: true,
  upperCase: true,
};
const DEFAULT_LENGTH = 12;
const getCrypto = () => window.crypto || window.msCrypto; // for IE 11
const buildCharsSet = options => {
  let validChats = '';
  validChats += options.upperCase ? options.symbols.upperCase : '';
  validChats += options.lowerCase ? options.symbols.lowerCase : '';
  validChats += options.digits ? options.symbols.digits : '';
  validChats += options.specials ? options.symbols.specials : '';
  return validChats;
};
const passwordGenerator = (
  length = DEFAULT_LENGTH,
  options = DEFAULT_OPTIONS,
) => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const validChars = buildCharsSet(opts);
  let array = new Uint8Array(length);
  const crypto = getCrypto();
  crypto.getRandomValues(array);
  array = array.map(x => validChars.charCodeAt(x % validChars.length));
  return String.fromCharCode.apply(null, array);
};

export default passwordGenerator;
