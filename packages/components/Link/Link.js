import React from 'react';
import styled from 'styled-components';
import NextLink from 'next/link';

const StyledAnchor = styled.a`
  cursor: pointer;
  font-size: 18px;
  color: ${({ theme }) => theme.color.black};

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
