import React from 'react';
import styled from 'styled-components';
import { Logo } from './Logo';

const LayoutWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.black};
  font-size: 14px;
`;

const LogoWrapper = styled.div`
  position: absolute;
  top: 20px;
  left: 60px;
`;

const AuthLayout = ({ children }) => (
  <LayoutWrapper>
    <LogoWrapper>
      <Logo />
    </LogoWrapper>
    {children}
  </LayoutWrapper>
);

export default AuthLayout;
