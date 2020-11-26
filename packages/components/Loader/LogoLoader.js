import React from 'react';
import styled, { keyframes } from 'styled-components';
import { loader as loaderImage } from '@caesar/assets/images';

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
  background-image: url(${loaderImage});
  animation: ${play} 2s steps(17) infinite;
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const LoadingText = styled.div`
  font-size: 18px;
  margin-top: 20px;
  color: ${({ theme, textColor }) =>
    theme.color[textColor] || theme.color.white};
  width: 100%;
  text-align: center;
`;

const LogoLoader = ({ textColor, className }) => (
  <LoaderWrapper className={className}>
    <Loader />
    <LoadingText textColor={textColor}>Loading…</LoadingText>
  </LoaderWrapper>
);

export default LogoLoader;
