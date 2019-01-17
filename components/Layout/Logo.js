import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Icon } from '../Icon';

const LogoLink = styled.a`
  display: block;
  transition: 0.3s;
  cursor: pointer;

  &:hover {
    opacity: 0.75;
  }
`;

export const Logo = () => (
  <Link href="/">
    <LogoLink>
      <Icon name="logo" width={116} height={25} />
    </LogoLink>
  </Link>
);
