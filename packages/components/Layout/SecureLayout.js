import React from 'react';
import styled from 'styled-components';
import LayoutConstructor from './LayoutConstructor';
import Footer from './Footer';
import { SecureHeader } from './SecureHeader';

const LayoutConstructorStyled = styled(LayoutConstructor)`
  padding: 0;

  ${LayoutConstructor.TopWrapper} {
    justify-content: space-between;
    padding: 15px 30px;
    border-bottom: 1px solid ${({ theme }) => theme.color.gallery};
  }

  ${LayoutConstructor.MainWrapper} {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }

  ${LayoutConstructor.BottomWrapper} {
    padding: 30px;
    margin-top: 0;
  }
`;

const SecureLayout = props => (
  <LayoutConstructorStyled
    headerComponent={<SecureHeader />}
    footerComponent={Footer}
    {...props}
  />
);

export default SecureLayout;
