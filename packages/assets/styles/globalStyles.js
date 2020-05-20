import { normalize } from 'polished';
import theme from '@caesar/common/theme';
import fonts from './fonts';

export default `
  ${normalize()};
  ${fonts};

  html {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    background-color: ${theme.color.white};
    min-width: 20rem;
    font-family: 'AvenirNext';
    font-weight: normal;
    font-style: normal;
    font-size: ${theme.font.size.main};
    line-height: ${theme.font.lineHeight.main};
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
