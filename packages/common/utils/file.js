import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export const BASE_64_LENGTH_BYTE_RATE = 3 / 4;

export const fileToBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export const filesToBase64 = files => {
  const promises = files.map(fileToBase64);

  return Promise.all(promises);
};

export const base64toBlob = (
  b64Data,
  mime = 'application/octet-stream',
  sliceSize = 512,
) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: mime });
};

export const parseBase64 = url => {
  const [mime, data] = url.split(',');

  return {
    data,
    mime: mime.match(/:(.*?);/)[1],
  };
};

export const downloadFile = (url, filename) => {
  const { data, mime } = parseBase64(url);
  const blob = base64toBlob(data, mime);

  saveAs(blob, decodeURIComponent(filename));
};

export const downloadAsZip = files => {
  const zip = new JSZip();

  files.forEach(({ name, raw }) => {
    const { data } = parseBase64(raw);
    zip.file(decodeURIComponent(name), data, { base64: true });
  });

  zip
    .generateAsync({ type: 'blob' })
    .then(blob => saveAs(blob, `attachments${Date.now()}.zip`));
};

export const splitFilesToUniqAndDuplicates = files => {
  const uniqFiles = [];
  const duplicatedFiles = [];

  const map = new Map();

  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    const checkLabel = `${file.name}_${file.raw.length}`;

    if (!map.has(checkLabel)) {
      map.set(checkLabel, true);
      uniqFiles.push(file);
    } else {
      duplicatedFiles.push(file);
    }
  }

  return { uniqFiles, duplicatedFiles };
};

export const extactExtFromFilename = fname => {
  const extPosition = fname.lastIndexOf('.');

  return fname.substr(extPosition + 1);
};

export const getFilenameWithoutExt = fname => {
  const extPosition = fname.lastIndexOf('.');

  return fname.substring(0, extPosition);
};

export const isBase64Encoded = dataString => {
  return dataString.indexOf(';base64') !== -1;
};

export const getRealFileSizeForBase64enc = length => {
  return length ? length * BASE_64_LENGTH_BYTE_RATE : 0;
};

export const getRealFileSizesForBase64enc = files => {
  return files
    ? files.reduce((acc, { raw }) => {
        if (isBase64Encoded(raw.substr(0, 50))) {
          return acc + raw.length;
        }

        return acc + getRealFileSizeForBase64enc(raw.length);
      }, 0)
    : 0;
};

export const makeAttachemntFromFile = file => ({
  name: getFilenameWithoutExt(file.name),
  ext: extactExtFromFilename(file.name),
  size: getRealFileSizeForBase64enc(file.raw.length),
  raw: file.raw,
});
export const makeFileFromAttachment = attachment => ({
  name: `${attachment.name}.${attachment.ext}`,
  raw: attachment.raw,
});
export const humanizeSize = (bytes, si = true, dp = 1) => {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`;
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;

  let formatedBytes = bytes;
  do {
    formatedBytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(formatedBytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return `${formatedBytes.toFixed(dp)} ${units[u]}`;
};
