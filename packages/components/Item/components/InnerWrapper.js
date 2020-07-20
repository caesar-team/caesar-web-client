import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  padding: 24px 40px;
`;

export const InnerWrapper = ({ children }) => {
  return <StyledWrapper>{children}</StyledWrapper>;
};
