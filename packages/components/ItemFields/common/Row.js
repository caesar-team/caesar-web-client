import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin-bottom: ${({ marginBottom }) => marginBottom || 16}px;
`;

export const Row = ({ marginBottom, children }) => {
  return <Wrapper marginBottom={marginBottom}>{children}</Wrapper>;
};
