import React from 'react';
import styled from 'styled-components';
import { Header } from './Header';

const LayoutWrapper = styled.div`
  min-height: 100vh;
`;

const Layout = ({ children, user }) => (
  <LayoutWrapper>
    <Header user={user} />
    <main>{children}</main>
  </LayoutWrapper>
);

export default Layout;
