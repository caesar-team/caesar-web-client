import React from 'react';
import styled from 'styled-components';
import LayoutConstructor from './LayoutConstructor';
import Footer from './Footer';

const LayoutConstructorStyled = styled(LayoutConstructor)`
  ${LayoutConstructor.TopWrapper} {
    justify-content: space-between;
    margin-bottom: 100px;
  }

  ${LayoutConstructor.MainWrapper} {
    max-width: 400px;
  }
`;

const AuthLayout = props => (
  <LayoutConstructorStyled footerComponent={Footer} {...props} />
);

export default AuthLayout;
