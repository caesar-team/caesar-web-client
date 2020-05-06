import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(50, 46, 47, 0.95);
  z-index: 11;
`;

const Overlay = ({ onClick, onMouseDown, ...props }) => (
  <Wrapper {...props} onClick={onClick} onMouseDown={onMouseDown} />
);

export default Overlay;
