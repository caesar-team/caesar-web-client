import React from 'react';
import styled from 'styled-components';
import LogoLoader from './LogoLoader';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.color.emperor};
`;

const FullScreenLoader = () => (
  <Wrapper>
    <LogoLoader />
  </Wrapper>
);

export default FullScreenLoader;
