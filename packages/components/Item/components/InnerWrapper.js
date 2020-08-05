import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  height: calc(100% - 56px);
  padding: 24px 40px;
`;

export const InnerWrapper = ({ children }) => {
  return <StyledWrapper>{children}</StyledWrapper>;
};
