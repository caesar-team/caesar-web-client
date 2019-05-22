export const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.style.display = 'none';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};
