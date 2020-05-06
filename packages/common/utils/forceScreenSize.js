import pwaDetector from './pwaDetector';

const sizeListener = (width, height) => {
  window.resizeTo(width, height);
};
export const fixedSizeListener = (width, height) => {
  if (pwaDetector()) {
    window.resizeTo(width, height); // Set to the default sizes
    // window.addEventListener('resize', () => {
    //   sizeListener(width, height);
    // });
  }
};
export const fixedSizeUnListener = () => {
  // if (pwaDetector()) {
  //   window.removeEventListener('resize', () => {});
  // }
};
