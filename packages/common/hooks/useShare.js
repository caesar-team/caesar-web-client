export const useShare = data =>
  typeof navigator.canShare !== 'undefined' &&
  navigator.canShare(data) === true;
