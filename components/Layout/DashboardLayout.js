import React from 'react';
import styled from 'styled-components';
import ScrollLock from 'react-scrolllock';
import LayoutConstructor from './LayoutConstructor';
import { Header } from './Header';

const LayoutConstructorStyled = styled(LayoutConstructor)`
  padding: 0;
  overflow: hidden;
`;

const DashboardLayout = ({ user, withSearch, children, ...props }) => (
  <LayoutConstructorStyled
    headerComponent={<Header user={user} withSearch={withSearch} />}
    {...props}
  >
    <ScrollLock>{children}</ScrollLock>
  </LayoutConstructorStyled>
);

export default DashboardLayout;
