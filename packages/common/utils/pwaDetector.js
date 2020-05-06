export default () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true;
