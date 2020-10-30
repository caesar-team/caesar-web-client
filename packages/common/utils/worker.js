import { isClient } from '@caesar/common/utils/isEnvironment';

const DEFAULT_LOGICAL_CORES_COUNT = 1;

// 2 * n + 1 is used here(where n is a count of physical cores,
// 2 * n gives us a count of logical cores),
// 1 web worker is being used by openpgp package
// hardwareConcurrency returns the number of logical cores
export function getWorkersCount() {
  return (
    (isClient ? navigator.hardwareConcurrency : DEFAULT_LOGICAL_CORES_COUNT) - 1
  );
}
