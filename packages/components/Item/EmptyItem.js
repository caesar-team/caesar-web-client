import React from 'react';
import styled from 'styled-components';
import { Icon } from '../Icon';

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

export const EmptyItem = () => (
  <Wrapper>
    <Icon name="logo-caesar-team" color="black" width={188} height={40} />
  </Wrapper>
);
