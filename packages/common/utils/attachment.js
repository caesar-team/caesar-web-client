import {
  getFilenameWithoutExt,
  extactExtFromFilename,
  getRealFileSizeForBase64enc,
} from './file';
import { uuid4 } from './uuid4';

export const makeAttachemntFromFile = file => ({
  name: getFilenameWithoutExt(file.name),
  ext: extactExtFromFilename(file.name),
  size: getRealFileSizeForBase64enc(file.raw.length),
  raw: file.raw,
});

export const processUploadedFiles = files => {
  const attachments = [];
  const raws = {};

  if (files) {
    files.forEach(attach => {
      const id = attach?.id || uuid4();
      raws[id] = attach.raw;
      attachments.push({
        id,
        name: getFilenameWithoutExt(attach.name) || attach.name,
        ext: extactExtFromFilename(attach.ext) || attach.ext,
        size: getRealFileSizeForBase64enc(attach.raw?.length),
      });
    });
  }

  return {
    attachments,
    raws,
  };
};
