import React from 'react';
import styled from 'styled-components';
import LayoutConstructor from './LayoutConstructor';
import PrimaryHeader from './PrimaryHeader';

const LayoutConstructorStyled = styled(LayoutConstructor)`
  padding: 0;

  ${LayoutConstructor.MainWrapper} {
    display: flex;
  }
`;

const SettingsLayout = ({ user, team, ...props }) => (
  <LayoutConstructorStyled
    headerComponent={<PrimaryHeader user={user} team={team} />}
    {...props}
  />
);

export default SettingsLayout;
