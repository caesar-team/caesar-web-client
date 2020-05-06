import regularEotUrl from '../fonts/AvenirNext-Regular.eot';
import regularTtfUrl from '../fonts/AvenirNext-Regular.ttf';
import regularWoffUrl from '../fonts/AvenirNext-Regular.woff';
import regularWoff2Url from '../fonts/AvenirNext-Regular.woff2';

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
