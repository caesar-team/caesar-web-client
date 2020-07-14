import React from 'react';
import styled from 'styled-components';
import { media } from '@caesar/assets/styles/media';
import { AppVersion } from '../AppVersion';
import LayoutConstructor from './LayoutConstructor';
import { SecureHeader } from './SecureHeader';
import { AppVersion } from './AppVersion';

const LayoutConstructorStyled = styled(LayoutConstructor)`
  padding: 0;
  background-image: url('/images/secure-bg-right.png'),
    url('/images/secure-bg-btn.png');
  background-size: 217px 300px, 279px 200px;
  background-position: calc(100% - 60px) 150px, 60px 550px;
  background-repeat: no-repeat, no-repeat;

  @media (min-resolution: 144dpi) and (min-resolution: 1.5dppx) {
    background-image: url('/images/secure-bg-right@2x.png'),
      url('/images/secure-bg-btn@2x.png');
  }

  @media (min-resolution: 288dpi) and (min-resolution: 3.0dppx) {
    background-image: url('/images/secure-bg-right@3x.png'),
      url('/images/secure-bg-btn@3x.png');
  }

  ${media.desktop`
    background-position: calc(100% - 30px) 150px, 30px 410px;
  `}

  ${media.wideMobile`
    background-position: calc(100% - 30px) 130px, 30px 380px;
  `}

  ${media.mobile`
    background-position: calc(100% + 40px) 85px, -90px 290px;
  `}

  ${LayoutConstructor.TopWrapper} {
    justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid ${({ theme }) => theme.color.gallery};

    ${media.desktop`
      padding-top: 8px;
      padding-bottom: 8px;
    `}

    ${media.mobile`
      padding-right: 16px;
      padding-left: 16px;
    `}
  }

  ${LayoutConstructor.MainWrapper} {
    width: 100%;
    max-width: 848px;
    padding: 0 24px;
    margin: 0 auto;

    ${media.mobile`
      padding-right: 16px;
      padding-left: 16px;
    `}
  }

  ${LayoutConstructor.BottomWrapper} {
    padding: 24px;
    margin-top: 0;

    ${media.mobile`
      padding-right: 16px;
      padding-left: 16px;
    `}
  }
`;


const SecureLayout = props => {
  return (
    <LayoutConstructorStyled
      headerComponent={<SecureHeader />}
      footerComponent={<AppVersion />}
      {...props}
    />
  );
};

export default SecureLayout;
