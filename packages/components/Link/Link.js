import React from 'react';
import styled from 'styled-components';
import NextLink from 'next/link';

const StyledAnchor = styled.a`
  color: ${({ theme }) => theme.color.black};
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.color.gray};
  }
`;

const Link = ({ to, onClick, children, isActive, className, ...props }) => (
  <NextLink href={to} {...props}>
    <StyledAnchor href={to} onClick={onClick} className={className}>
      {children}
    </StyledAnchor>
  </NextLink>
);

export default Link;
