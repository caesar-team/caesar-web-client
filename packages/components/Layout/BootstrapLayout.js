import React from 'react';
import styled from 'styled-components';
import LayoutConstructor from './LayoutConstructor';
import BootstrapHeader from './BootstrapHeader';
import Footer from './Footer';

const LayoutConstructorStyled = styled(LayoutConstructor)`
  padding: 0 0 30px 0;

  ${LayoutConstructor.MainWrapper} {
    padding: 0 60px;
    max-width: 610px;
    position: relative;
  }
`;

const BootstrapLayout = ({ currentUser, ...props }) => (
  <LayoutConstructorStyled
    headerComponent={<BootstrapHeader currentUser={currentUser} />}
    footerComponent={Footer}
    {...props}
  />
);

export default BootstrapLayout;
