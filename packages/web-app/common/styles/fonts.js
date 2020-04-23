import regularEotUrl from 'public/fonts/AvenirNext-Regular.eot';
import regularTtfUrl from 'public/fonts/AvenirNext-Regular.ttf';
import regularWoffUrl from 'public/fonts/AvenirNext-Regular.woff';
import regularWoff2Url from 'public/fonts/AvenirNext-Regular.woff2';

export default `
  @font-face {
    font-family: 'AvenirNext';
    font-weight: normal;
    font-style: normal;
    src:
      url(${regularWoffUrl}) format('woff'),
      url(${regularWoff2Url}) format('woff2'),
      url(${regularTtfUrl}) format('ttf');
      url(${regularEotUrl}) format('eot');
  }
`;
