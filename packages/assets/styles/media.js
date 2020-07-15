import { css } from 'styled-components';

export const MEDIA_QUERIES = {
  desktop: '1439px', // 1024-1439
  tablet: '1023px', // 780-1023
  wideMobile: '779px', // 620-779
  middleMobile: '619px', // 480-619
  mobile: '479px', // 375-479
  narrowMobile: '374px', // 320-374
};

export const media = Object.keys(MEDIA_QUERIES).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${MEDIA_QUERIES[label]}) {
      ${css(...args)}
    }
  `;

  return acc;
}, {});
