import React from 'react';
import styled, { keyframes } from 'styled-components';

const circle = keyframes`
  0% {transform: rotate(0deg) scale(1)}
  50% {transform: rotate(180deg) scale(0.8)}
  100% {transform: rotate(360deg) scale(1)}
`;

const Loader = styled.div`
  background: transparent !important;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 100%;
  border: 2px solid;
  border-color: ${({ color }) => color};
  border-bottom-color: transparent;
  display: inline-block;
  animation: ${circle} 0.75s 0s infinite linear;
  animation-fill-mode: both;
`;

const CircleLoader = ({ size, color = '#000' }) => (
  <Loader size={size} color={color} />
);

export default CircleLoader;
