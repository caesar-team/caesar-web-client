import React from 'react';
import styled from 'styled-components';
import LayoutConstructor from './LayoutConstructor';

const LayoutConstructorStyled = styled(LayoutConstructor)`
  padding-top: 16px;

  ${LayoutConstructor.TopWrapper} {
    justify-content: space-between;
    margin-bottom: 20px;
  }

  ${LayoutConstructor.MainWrapper} {
    max-width: 400px;
  }
`;

const AuthLayout = props => (
  <LayoutConstructorStyled {...props} />
);

export default AuthLayout;
