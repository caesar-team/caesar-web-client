import React from 'react';
import styled from 'styled-components';
import { APP_VERSION } from '@caesar/common/constants';

const Wrapper = styled.div`
  font-size: ${({ theme }) => theme.font.size.xs};
  line-height: ${({ theme }) => theme.font.lineHeight.xs};
  color: ${({ theme }) => theme.color.gray};
`;

export const AppVersion = ({ className }) => (
  <Wrapper className={className}>{APP_VERSION}</Wrapper>
);
