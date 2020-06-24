import React from 'react';
import styled from 'styled-components';
import { Icon } from '../Icon';

const Wrapper = styled.div`
  z-index: ${({ theme }) => theme.zIndex.overlay};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
`;

const Loader = () => (
  <Wrapper>
    <Icon type="loading" size={72} />
  </Wrapper>
);

export default Loader;
