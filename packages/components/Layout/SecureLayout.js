import React from 'react';
import styled from 'styled-components';
import { media } from '@caesar/assets/styles/media';
import LayoutConstructor from './LayoutConstructor';
import { SecureHeader } from './SecureHeader';

const LayoutConstructorStyled = styled(LayoutConstructor)`
  padding: 0;

  ${LayoutConstructor.TopWrapper} {
    justify-content: space-between;
    padding: 8px 24px;
    border-bottom: 1px solid ${({ theme }) => theme.color.gallery};

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

const Version = styled.div`
  z-index: 1;
  font-size: 12px;
  color: ${({ theme }) => theme.color.gray};
`;

const SecureLayout = props => (
  <LayoutConstructorStyled
    headerComponent={<SecureHeader />}
    footerComponent={<Version>v.1.0.1-112604c.0</Version>}
    {...props}
  />
);

export default SecureLayout;
