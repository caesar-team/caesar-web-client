import { normalize } from 'polished';
import { css } from 'linaria';

export default css`
  :global() {
    @font-face {
      font-family: 'AvenirNext';
      font-weight: normal;
      font-style: normal;
      src: url(/fonts/AvenirNext-Regular.woff) format('woff'),
        url(/fonts/AvenirNext-Regular.woff2) format('woff2'),
        url(/fonts/AvenirNext-Regular.ttf) format('ttf'),
        url(/fonts/AvenirNext-Regular.eot) format('eot');
    }

    html {
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      background-color: #fff;
      min-width: 20rem;
      font-family: 'AvenirNext';
      font-weight: normal;
      font-style: normal;
      font-size: 16px;
      line-height: 1.5;
      letter-spacing: 0.4px;
    }

    button,
    input,
    optgroup,
    select,
    textarea {
      font-family: 'AvenirNext';
      font-weight: normal;
      font-style: normal;
    }

    html,
    body,
    #root {
      height: 100%;
      margin: 0;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    div {
      user-select: none;
    }

    .modal-is-opened {
      overflow: hidden;
    }
  }
`;
