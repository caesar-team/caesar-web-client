import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export function filesToBase64(files) {
  const promises = files.map(fileToBase64);

  return Promise.all(promises);
}

export function base64toBlob(
  b64Data,
  mime = 'application/octet-stream',
  sliceSize = 512,
) {
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
}

export function parseBase64(url) {
  const [mime, data] = url.split(',');

  return {
    data,
    mime: mime.match(/:(.*?);/)[1],
  };
}

export function downloadFile(url, filename) {
  const { data, mime } = parseBase64(url);
  const blob = base64toBlob(data, mime);

  saveAs(blob, filename);
}

export function downloadAsZip(files) {
  const zip = new JSZip();

  files.forEach(({ name, raw }) => {
    const { data } = parseBase64(raw);
    zip.file(name, data, { base64: true });
  });

  zip
    .generateAsync({ type: 'blob' })
    .then(blob => saveAs(blob, `attachments${Date.now()}.zip`));
}

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
