import { isClient } from 'common/utils/isEnvironment';

export function getWorkersCount() {
  return isClient ? navigator.hardwareConcurrency + 1 : 4;
}
