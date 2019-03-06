import React from 'react';
import styled from 'styled-components';
import LayoutConstructor from './LayoutConstructor';
import Footer from './Footer';
import { Icon } from '../Icon';

const LayoutConstructorStyled = styled(LayoutConstructor)`
  ${LayoutConstructor.TopWrapper} {
    justify-content: space-between;
    margin-bottom: 100px;
  }

  ${LayoutConstructor.MainWrapper} {
    max-width: 530px;
  }
`;

const BootstrapLayout = props => (
  <LayoutConstructorStyled
    withImages
    headerComponent={<Icon name="logo-new" width={142} height={40} />}
    footerComponent={Footer}
    {...props}
  />
);

export default BootstrapLayout;
