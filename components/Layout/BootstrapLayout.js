import React from 'react';
import styled from 'styled-components';
import LayoutConstructor from './LayoutConstructor';
import Footer from './Footer';

const LayoutConstructorStyled = styled(LayoutConstructor)`
  ${LayoutConstructor.TopWrapper} {
    display: grid;
    grid-template-columns: 1fr repeat(3, auto) 1fr;
    justify-items: center;
    margin-bottom: 100px;
  }

  ${LayoutConstructor.MainWrapper} {
    max-width: 610px;
  }
`;

const BootstrapLayout = ({ headerComponent, ...props }) => (
  <LayoutConstructorStyled
    withImages
    headerComponent={headerComponent}
    footerComponent={Footer}
    {...props}
  />
);

export default BootstrapLayout;
