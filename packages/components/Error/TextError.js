import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin-top: ${({ marginTop }) => marginTop}px;
  font-size: ${({ theme }) => theme.font.size.small};
  color: ${({ theme }) => theme.color.red};
`;

export const TextError = ({ marginTop = 0, children, className }) => (
  <Wrapper marginTop={marginTop} className={className}>
    {children}
  </Wrapper>
);
