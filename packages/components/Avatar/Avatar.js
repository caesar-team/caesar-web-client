import React from 'react';
import styled from 'styled-components';
import Gravatar from 'react-gravatar';
import { API_URI } from '@caesar/common/constants';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  list-style: none;
  text-align: center;
  background: ${({ theme }) => theme.color.gray};
  color: ${({ theme }) => theme.color.white};
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  vertical-align: middle;
  width: ${({ isSmall }) => (isSmall ? '32px' : '40px')};
  min-width: ${({ isSmall }) => (isSmall ? '32px' : '40px')};
  height: ${({ isSmall }) => (isSmall ? '32px' : '40px')};
  border-radius: 50%;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  vertical-align: middle;
  border-style: none;
`;

export const Avatar = ({
  name,
  email,
  avatar,
  children,
  isSmall,
  ...props
}) => {
  if (children) {
    return (
      <Wrapper isSmall={isSmall} {...props}>
        {children}
      </Wrapper>
    );
  }

  if (avatar) {
    const avatarIcon = avatar.startsWith('data:')
      ? avatar
      : `${API_URI}/${avatar}`;

    return (
      <Wrapper isSmall={isSmall} {...props}>
        <Image src={avatarIcon} />
      </Wrapper>
    );
  }

  if (email) {
    return (
      <Wrapper isSmall={isSmall} {...props}>
        <Gravatar email={email} size={isSmall ? 32 : 40} />
      </Wrapper>
    );
  }

  const personLetters = name ? name.slice(0, 2).toUpperCase() : '';

  return (
    <Wrapper isSmall={isSmall} {...props}>
      {personLetters}
    </Wrapper>
  );
};
