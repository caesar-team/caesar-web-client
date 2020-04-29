import { css } from 'styled-components';

export const MEDIA_QUERIES = {
  tablet: '1023px', // 780-1023
  wideMobile: '779px', // 480-779
  mobile: '479px', // 320-479
};

export const media = Object.keys(MEDIA_QUERIES).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${MEDIA_QUERIES[label]}) {
      ${css(...args)}
    }
  `;

  return acc;
}, {});
