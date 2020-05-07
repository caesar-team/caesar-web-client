export const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.style.display = 'none';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

export const pastFromClipboard = e => {
  // Get pasted data via clipboard API
  const clipboardData = e.clipboardData || window.clipboardData;
  const pastedData = clipboardData.getData('Text');
  if (pastedData != null && pastedData.length > 0) {
    return pastedData;
  }
  return null;
};
