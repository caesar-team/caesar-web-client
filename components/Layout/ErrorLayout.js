import React from 'react';
import styled from 'styled-components';
import LayoutConstructor from './LayoutConstructor';

const LayoutConstructorStyled = styled(LayoutConstructor)`
  ${LayoutConstructor.TopWrapper} {
    justify-content: space-between;
    margin-bottom: 100px;
  }

  ${LayoutConstructor.MainWrapper} {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

const ErrorLayout = props => <LayoutConstructorStyled {...props} />;

export default ErrorLayout;
