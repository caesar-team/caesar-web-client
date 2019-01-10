import muliRegularWoffUrl from 'static/fonts/Muli-Regular.woff';
import muliRegularWoff2Url from 'static/fonts/Muli-Regular.woff2';
import muliRegularTtfUrl from 'static/fonts/Muli-Regular.ttf';
import muliRegularEotUrl from 'static/fonts/Muli-Regular.eot';
import muliRegularOtfUrl from 'static/fonts/Muli-Regular.otf';

export default `
  @font-face {
    font-family: 'Muli';
    font-weight: normal;
    font-style: normal;
    src:
      url(${muliRegularWoff2Url}) format('woff2'),
      url(${muliRegularWoffUrl}) format('woff'),
      url(${muliRegularTtfUrl}) format('ttf');
      url(${muliRegularEotUrl}) format('eot');
      url(${muliRegularOtfUrl}) format('otf');
  }
`;
