import React from 'react';
import styled from 'styled-components';
import { media } from '@caesar/assets/styles/media';
import LayoutConstructor from './LayoutConstructor';
import Footer from './Footer';
import { SecureHeader } from './SecureHeader';

const LayoutConstructorStyled = styled(LayoutConstructor)`
  padding: 0;

  ${LayoutConstructor.TopWrapper} {
    justify-content: space-between;
    padding: 15px 30px;
    border-bottom: 1px solid ${({ theme }) => theme.color.gallery};

    ${media.mobile`
      padding-right: 20px;
      padding-left: 20px;
    `}
  }

  ${LayoutConstructor.MainWrapper} {
    width: 100%;
    max-width: 860px;
    padding: 0 30px;
    margin: 0 auto;

    ${media.mobile`
      padding-right: 20px;
      padding-left: 20px;
    `}
  }

  ${LayoutConstructor.BottomWrapper} {
    padding: 30px;
    margin-top: 0;

    ${media.mobile`
      padding-right: 20px;
      padding-left: 20px;
    `}
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
