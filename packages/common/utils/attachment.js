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

export const splitAttachmentFromRaw = data => {
  let attachments;
  let raws = [];
  if (data.attachments) {
    raws = data.attachments.map(attach => attach.raw);
    attachments = data.attachments.map(attach => {
      return {
        name: getFilenameWithoutExt(attach.name),
        ext: extactExtFromFilename(attach.name),
        size: getRealFileSizeForBase64enc(attach.raw?.length),
      };
    });
  }

  return {
    ...data,
    attachments,
    raws,
  };
};
