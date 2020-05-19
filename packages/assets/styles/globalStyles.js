import { normalize } from 'polished';
import fonts from './fonts';

export default `
  ${normalize()};
  ${fonts};

  html {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    background-color: #fff;
    min-width: 20rem;
    font-family: 'AvenirNext';
    font-weight: normal;
    font-style: normal;
    font-size: 16px;
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
`;
