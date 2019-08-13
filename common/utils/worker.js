export function getWorkersCount() {
  return navigator.hardwareConcurrency + 1;
}
