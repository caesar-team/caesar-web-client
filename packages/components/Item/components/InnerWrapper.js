import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { media } from '@caesar/assets/styles/media';

const StyledWrapper = styled.div`
  height: calc(100% - 56px);
  padding: 24px 40px;

  ${media.mobile`
    padding: 16px;
  `}
`;

export const InnerWrapper = forwardRef(({ children, className }, ref) => (
  <StyledWrapper ref={ref} className={className}>
    {children}
  </StyledWrapper>
));
