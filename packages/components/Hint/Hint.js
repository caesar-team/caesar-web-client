import React from 'react';
import styled from 'styled-components';

const Inner = styled.div`
  position: absolute;
  top: -8px;
  left: 50%;
  z-index: ${({ theme }) => theme.zIndex.hidden};
  padding: 4px 8px;
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: 600;
  text-transform: none;
  white-space: nowrap;
  color: ${({ theme }) => theme.color.white};
  background-color: ${({ theme }) => theme.color.black};
  border-radius: 4px;
  transform: translate(-50%, -100%);
  opacity: 0;
  transition: z-index 0.2s, opacity 0.2s;
`;

const Wrapper = styled.div`
  position: relative;

  &:hover ${Inner} {
    z-index: ${({ theme }) => theme.zIndex.basic};
    opacity: 1;
  }
`;

export const Hint = ({ text, children }) => (
  <Wrapper>
    {children}
    {text && <Inner>{text}</Inner>}
  </Wrapper>
);
