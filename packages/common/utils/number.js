export const formatNumber = ({ value, separator = ' ' }) =>
  value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${separator}`);
