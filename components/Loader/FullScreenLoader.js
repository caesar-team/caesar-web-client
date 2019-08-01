import React from 'react';
import styled, { keyframes } from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.emperor};
`;

const play = keyframes`
  from { background-position: 0; }
  to { background-position: -1700px; }
`;

const LoaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Loader = styled.div`
  width: 100px;
  height: 100px;
  background-image: url('/public/images/loader.png');
  animation: ${play} 2s steps(17) infinite;
  border-radius: 3px;
`;

const LoadingText = styled.div`
  font-size: 18px;
  letter-spacing: 0.6px;
  margin-top: 20px;
  color: ${({ theme }) => theme.white};
  width: 100%;
  text-align: center;
`;

const FullScreenLoader = () => (
  <Wrapper>
    <LoaderWrapper>
      <Loader />
      <LoadingText>Loading…</LoadingText>
    </LoaderWrapper>
  </Wrapper>
);

export default FullScreenLoader;
