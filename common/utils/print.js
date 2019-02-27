export function printElement(elementId) {
  const printContents = document.getElementById(elementId).innerHTML;
  const originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;

  window.print();

  document.body.innerHTML = originalContents;
}
