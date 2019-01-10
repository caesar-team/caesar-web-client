import React from 'react';
import styled from 'styled-components';
import './icons';

const Svg = styled.svg`
  display: inline-block;
  vertical-align: middle;
`;

const Icon = ({ name, ...props }) => {
  if (!name) {
    return null;
  }

  return (
    <Svg {...props}>
      <use xlinkHref={`#icon-${name}--sprite`} />
    </Svg>
  );
};

export default Icon;
