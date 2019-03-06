import React from 'react';
import styled from 'styled-components';
import LayoutConstructor from './LayoutConstructor';
import { Header } from './Header';

const LayoutConstructorStyled = styled(LayoutConstructor)`
  padding: 0;
`;

const SettingsLayout = ({ user, ...props }) => (
  <LayoutConstructorStyled
    headerComponent={<Header user={user} />}
    {...props}
  />
);

export default SettingsLayout;
