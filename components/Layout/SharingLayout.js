import React from 'react';
import styled from 'styled-components';
import LayoutConstructor from './LayoutConstructor';
import Footer from './Footer';
import { Icon } from '../Icon';

const LayoutConstructorStyled = styled(LayoutConstructor)`
  ${LayoutConstructor.TopWrapper} {
    justify-content: space-between;
    border-bottom: 1px solid ${({ theme }) => theme.gallery};
    margin-bottom: 10px;
  }

  ${LayoutConstructor.MainWrapper} {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }
`;

const SharingLayout = props => (
  <LayoutConstructorStyled
    withImages
    headerComponent={<Icon name="logo-new" width={142} height={40} />}
    footerComponent={Footer}
    {...props}
  />
);

export default SharingLayout;
