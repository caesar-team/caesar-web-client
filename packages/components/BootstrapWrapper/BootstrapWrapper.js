import React from 'react';
import styled from 'styled-components';
import { AuthLayout } from '../Layout';

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 600px;
  width: 100%;
`;

const BootstrapWrapper = ({ children }) => (
  <AuthLayout>
    <InnerWrapper>{children}</InnerWrapper>
  </AuthLayout>
);

export default BootstrapWrapper;
