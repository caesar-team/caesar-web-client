import React from 'react';
import styled from 'styled-components';
import { Icon } from '../../Icon';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  font-size: ${({ theme }) => theme.font.size.small};
  color: ${({ theme }) => theme.color.white};
  background-color: ${({ theme }) => theme.color.emperor};
`;

const StyledIcon = styled(Icon)`
  margin-right: 16px;
`;

export const ReadOnlyBanner = () => (
  <Wrapper>
    <StyledIcon name="warning" color="white" width={16} height={16} />
    You can read only
  </Wrapper>
);
