import React from 'react';
import styled from 'styled-components';
import { APP_VERSION } from '@caesar/common/constants';
import { media } from '@caesar/assets/styles/media';
import LayoutConstructor from './LayoutConstructor';
import { SecureHeader } from './SecureHeader';
import { AppVersion } from './AppVersion';

const LayoutConstructorStyled = styled(LayoutConstructor)`
  ${LayoutConstructor.Wrapper} {
    padding: 0;
  }

  ${LayoutConstructor.TopWrapper} {
    justify-content: space-between;
    margin-bottom: 100px;
  }
  
  ${LayoutConstructor.MainWrapper} {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    background-image: url('/images/error-left.png'),
      url('/images/error-right.png');
    background-size: 262px 480px, 281px 397px;
    background-position: calc(50% - 220px) 50%, calc(50% + 220px) 160px;
    background-repeat: no-repeat, no-repeat;
    
    @media (min-resolution: 144dpi) and (min-resolution: 1.5dppx) {
      background-image: url('/images/error-left@2x.png'),
        url('/images/error-right@2x.png');
    }
    
    ${media.wideMobile`
      background-size: 208px 380px, 210px 297px;
      background-position: calc(50% - 190px) 50%, calc(50% + 180px) 200px;
    `}
    
    ${media.mobile`
      background-size: 179px 328px, 175px 247px;
      background-position: 10% 60px, calc(100% - 30px) 300px;
    `}
    
    ${media.narrowMobile`
      background-size: 164px 300px, 145px 200px;
    `}    
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
