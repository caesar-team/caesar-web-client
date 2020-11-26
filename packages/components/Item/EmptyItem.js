import React from 'react';
import styled from 'styled-components';
import { Icon } from '../Icon';

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-image: url('/images/empty-item.png');
  background-size: 672px auto;
  background-position: center center;
  background-repeat: no-repeat;

  @media (min-resolution: 144dpi) and (min-resolution: 1.5dppx) {
    background-image: url('/images/empty-item@2x.png');
  }

  @media (min-resolution: 288dpi) and (min-resolution: 3dppx) {
    background-image: url('/images/empty-item@3x.png');
  }
`;

export const EmptyItem = () => (
  <Wrapper>
    <Icon name="logo-caesar-team" color="black" width={188} height={40} />
  </Wrapper>
);
