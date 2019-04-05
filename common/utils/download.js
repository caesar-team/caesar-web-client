export function downloadElement(elementId) {
  const a = document.body.appendChild(document.createElement('a'));

  a.download = 'export.txt';
  a.href = `data:text/plain;charset=utf-8,${
    document.getElementById(elementId).innerText
  }`;

  a.click();
}
