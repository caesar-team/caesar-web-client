import React from 'react';
import styled from 'styled-components';
import { Header } from './Header';

const LayoutWrapper = styled.div`
  min-height: 100vh;

  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex-grow: 1;
`;

const Layout = ({ children, user }) => (
  <LayoutWrapper>
    <Header user={user} />
    <Main>{children}</Main>
  </LayoutWrapper>
);

export default Layout;
