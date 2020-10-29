import React from 'react';
import styled from 'styled-components';
import LayoutConstructor from './LayoutConstructor';
import { PrimaryHeader } from './PrimaryHeader';

const LayoutConstructorStyled = styled(LayoutConstructor)`
  padding: 0;

  ${LayoutConstructor.MainWrapper} {
    display: flex;
  }
`;

const SettingsLayout = ({ currentUser, ...props }) => (
  <LayoutConstructorStyled
    headerComponent={<PrimaryHeader currentUser={currentUser} />}
    {...props}
  />
);

export default SettingsLayout;
