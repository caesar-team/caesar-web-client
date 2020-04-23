import React from 'react';
import styled from 'styled-components';
import { Icon } from '../Icon';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  z-index: 100;
`;

const Loader = () => (
  <Wrapper>
    <Icon type="loading" size={72} />
  </Wrapper>
);

export default Loader;
