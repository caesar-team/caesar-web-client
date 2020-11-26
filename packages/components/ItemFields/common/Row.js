import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin-bottom: ${({ marginBottom }) => marginBottom || 16}px;
`;

export const Row = ({ marginBottom, children, className }) => {
  return (
    <Wrapper marginBottom={marginBottom} className={className}>
      {children}
    </Wrapper>
  );
};
