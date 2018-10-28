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

export function base64toFile(url, filename) {
  const { data, mime } = parseBase64(url);

  const encoded = atob(data);
  let n = encoded.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = encoded.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

export function downloadFile(url, filename) {
  const { data, mime } = parseBase64(url);
  const blob = base64toBlob(data, mime);

  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    const blobURL = window.URL.createObjectURL(blob);
    const tempLink = document.createElement('a');

    tempLink.style.display = 'none';
    tempLink.href = blobURL;
    tempLink.setAttribute('download', filename);

    // Safari case
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank');
    }

    document.body.appendChild(tempLink);

    tempLink.click();

    document.body.removeChild(tempLink);

    window.URL.revokeObjectURL(blobURL);
  }
}
