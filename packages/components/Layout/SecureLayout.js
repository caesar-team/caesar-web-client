import React from 'react';
import styled from 'styled-components';
import { media } from '@caesar/assets/styles/media';
import { APP_VERSION } from '@caesar/common/constants';
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

const AppVersion = styled.div`
  z-index: 1;
  font-size: ${({ theme }) => theme.font.size.xs};
  line-height: ${({ theme }) => theme.font.lineHeight.xs};
  color: ${({ theme }) => theme.color.gray};
`;

const SecureLayout = props => {
  return (
    <LayoutConstructorStyled
      headerComponent={<SecureHeader />}
      footerComponent={<AppVersion>{APP_VERSION}</AppVersion>}
      {...props}
    />
  );
};

export default SecureLayout;
