import React from 'react';
import styled from 'styled-components';
import { Header } from './Header';

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.black};
  font-size: 14px;
`;

const Main = styled.main`
  flex-grow: 1;
`;

const Layout = ({ children, user, withSearch }) => (
  <LayoutWrapper>
    <Header user={user} withSearch={withSearch} />
    <Main>{children}</Main>
  </LayoutWrapper>
);

export default Layout;
