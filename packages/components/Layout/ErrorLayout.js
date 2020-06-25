import React from 'react';
import styled from 'styled-components';
import { APP_VERSION } from '@caesar/common/constants';
import LayoutConstructor from './LayoutConstructor';
import { SecureHeader } from './SecureHeader';
import { AppVersion } from './AppVersion';

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

const ErrorLayout = props => (
  <LayoutConstructorStyled
    headerComponent={<SecureHeader />}
    footerComponent={<AppVersion>{APP_VERSION}</AppVersion>}
    {...props}
  />
);

export default ErrorLayout;
