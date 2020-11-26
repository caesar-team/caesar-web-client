import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import {
  IS_SECURE_APP,
  IS_AUTHORIZATION_ENABLE,
} from '@caesar/common/constants';
import { useMedia } from '@caesar/common/hooks';
import { LogoCaesarDomain } from '../LogoCaesarDomain';
import { Icon } from '../Icon';

const LogoLink = styled.a`
  display: block;
  transition: 0.2s;

  &:hover {
    opacity: 0.75;
  }
`;

const SecureAppLogo = ({ href }) => {
  const { isMobile, isWideDesktop } = useMedia();

  return (
    <LogoLink href={href}>
      {isMobile ? (
        <Icon name="caesar" width={25} height={30} color="black" />
      ) : (
        <Icon
          name="logo-caesar-secure"
          width={isWideDesktop ? 200 : 170}
          height={isWideDesktop ? 40 : 30}
          color="black"
        />
      )}
    </LogoLink>
  );
};

const MainAppLogo = ({ href, width, height }) => (
  <Link passHref href={href}>
    <LogoLink>
      <LogoCaesarDomain width={width} height={height} />
    </LogoLink>
  </Link>
);

export const Logo = ({ href, width, height }) => {
  return IS_SECURE_APP || !IS_AUTHORIZATION_ENABLE ? (
    <SecureAppLogo href={href} />
  ) : (
    <MainAppLogo href={href} width={width} height={height} />
  );
};
