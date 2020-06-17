import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: ${({ theme }) => theme.zIndex.overlay};
  background-color: rgba(0, 0, 0, 0.5);
`;

export const Overlay = ({ onClick, onMouseDown, ...props }) => (
  <Wrapper {...props} onClick={onClick} onMouseDown={onMouseDown} />
);
