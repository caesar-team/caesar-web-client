export function downloadElement(elementId) {
  const a = document.body.appendChild(document.createElement('a'));

  a.download = '2fa_backup_codes.txt';
  a.href = `data:text/plain;charset=utf-8,${
    document.getElementById(elementId).innerText
  }`;

  a.click();
}

export function downloadTextData(data) {
  const a = document.body.appendChild(document.createElement('a'));

  a.download = '2fa_backup_codes.txt';
  a.href = `data:text/plain;charset=utf-8,${data}`;

  a.click();
}
