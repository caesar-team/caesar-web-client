export function downloadElement(elementId) {
  const a = document.body.appendChild(document.createElement('a'));

  a.download = 'export.html';
  a.href = `data:text/html,${document.getElementById(elementId).innerHTML}`;

  a.click();
}
