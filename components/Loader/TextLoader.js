import React from 'react';
import styled, { keyframes } from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 9999;
`;

const blurText = keyframes`
  0% {
    filter: blur(0px);
  }
  100% {
    filter: blur(4px);
  }
`;

const LoadingText = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
  width: 100%;
  height: 100px;
  line-height: 100px;

  > span {
    display: inline-block;
    font-weight: 300;
    margin: 0 5px;
    color: ${({ color }) => (color === 'white' ? '#fff' : '#000')};

    &:nth-child(1) {
      animation: ${blurText} 1.5s 0s infinite linear alternate;
    }

    &:nth-child(2) {
      animation: ${blurText} 1.5s 0.2s infinite linear alternate;
    }

    &:nth-child(3) {
      animation: ${blurText} 1.5s 0.4s infinite linear alternate;
    }

    &:nth-child(4) {
      animation: ${blurText} 1.5s 0.6s infinite linear alternate;
    }

    &:nth-child(5) {
      animation: ${blurText} 1.5s 0.8s infinite linear alternate;
    }

    &:nth-child(6) {
      animation: ${blurText} 1.5s 1s infinite linear alternate;
    }

    &:nth-child(7) {
      animation: ${blurText} 1.5s 1.2s infinite linear alternate;
    }
  }
`;

const TextLoader = ({ color }) => (
  <Wrapper>
    <LoadingText color={color}>
      <span className="loading-text-words">L</span>
      <span className="loading-text-words">O</span>
      <span className="loading-text-words">A</span>
      <span className="loading-text-words">D</span>
      <span className="loading-text-words">I</span>
      <span className="loading-text-words">N</span>
      <span className="loading-text-words">G</span>
    </LoadingText>
  </Wrapper>
);

export default TextLoader;
