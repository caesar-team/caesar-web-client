import {
  getFilenameWithoutExt,
  extactExtFromFilename,
  getRealFileSizeForBase64enc,
} from './file';

export const makeAttachemntFromFile = file => ({
  name: getFilenameWithoutExt(file.name),
  ext: extactExtFromFilename(file.name),
  size: getRealFileSizeForBase64enc(file.raw.length),
  raw: file.raw,
});
