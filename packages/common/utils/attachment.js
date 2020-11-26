import {
  getFilenameWithoutExt,
  extactExtFromFilename,
  getRealFileSizeForBase64enc,
} from './file';
import { uuid4 } from './uuid4';

export const makeAttachemntFromFile = file => {
  return {
    name: getFilenameWithoutExt(file.name),
    ext: extactExtFromFilename(file.name),
    size: getRealFileSizeForBase64enc(file.raw.length),
    raw: file.raw,
  };
};

export const extractRawFromAttachment = files => {
  const attachments = [];
  const raws = {};

  if (files) {
    files.forEach(({ raw, ...attach }) => {
      const id = attach?.id || uuid4();
      raws[id] = raw;
      attachments.push({
        id,
        ...attach,
      });
    });
  }

  return {
    attachments,
    raws,
  };
};

export const processUploadedFiles = files => {
  const attachments = [];
  const raws = {};

  if (files) {
    files.forEach(attach => {
      const id = attach?.id || uuid4();
      raws[id] = attach.raw;
      attachments.push({
        id,
        name: attach.name || getFilenameWithoutExt(attach.name),
        ext: attach.ext || extactExtFromFilename(attach.name),
        size: attach.size || getRealFileSizeForBase64enc(attach.raw?.length),
      });
    });
  }

  return {
    attachments,
    raws,
  };
};
