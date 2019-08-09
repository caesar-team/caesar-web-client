import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Icon } from '../Icon';

const LogoLink = styled.a`
  display: block;
  transition: 0.3s;

  &:hover {
    opacity: 0.75;
  }
`;

const DEFAULT_LOGO_WIDTH = 106;
const DEFAULT_LOGO_HEIGHT = 30;

export const Logo = ({
  href,
  iconName = 'logo-new',
  width = DEFAULT_LOGO_WIDTH,
  height = DEFAULT_LOGO_HEIGHT,
}) => (
  <Link passHref href={href}>
    <LogoLink>
      <Icon name={iconName} width={width} height={height} />
    </LogoLink>
  </Link>
);
