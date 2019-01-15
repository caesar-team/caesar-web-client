import React from 'react';
import styled from 'styled-components';
import './icons';

const Svg = styled.svg`
  display: inline-block;
  vertical-align: middle;
  fill: ${({ isInButton }) => (isInButton ? 'currentColor' : '')};
`;

const Icon = ({ name, isInButton, ...props }) => {
  if (!name) {
    return null;
  }

  return (
    <Svg isInButton={isInButton} {...props}>
      <use xlinkHref={`#icon-${name}--sprite`} />
    </Svg>
  );
};

export default Icon;
