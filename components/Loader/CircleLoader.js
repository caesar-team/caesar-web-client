import React from 'react';
import styled from 'styled-components';

const StyledSpinner = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  animation: rotate 1s linear infinite;
  width: 16px;
  height: 16px;

  & .path {
    stroke: ${({ theme }) => theme.white};
    stroke-linecap: round;
    animation: dash 3.5s ease-in-out infinite;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
`;

const Circle = props => (
  <StyledSpinner viewBox="0 0 50 50" {...props}>
    <circle
      className="path"
      cx="25"
      cy="25"
      r="20"
      fill="none"
      strokeWidth="12"
    />
  </StyledSpinner>
);

export default Circle;
