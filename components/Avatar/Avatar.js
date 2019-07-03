import React from 'react';
import styled from 'styled-components';
import Gravatar from 'react-gravatar';
import { API_URI } from 'common/constants';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  list-style: none;
  text-align: center;
  background: ${({ theme }) => theme.gray};
  color: ${({ theme }) => theme.white};
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  vertical-align: middle;
  width: ${({ isSmall }) => (isSmall ? '30px' : '40px')};
  height: ${({ isSmall }) => (isSmall ? '30px' : '40px')};
  border-radius: 50%;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  vertical-align: middle;
  border-style: none;
`;

const Avatar = ({ name, email, avatar, children, isSmall, ...props }) => {
  if (children) {
    return (
      <Wrapper isSmall={isSmall} {...props}>
        {children}
      </Wrapper>
    );
  }

  if (avatar) {
    return (
      <Wrapper isSmall={isSmall} {...props}>
        <Image src={`${API_URI}/${avatar}`} />
      </Wrapper>
    );
  }

  if (email) {
    return (
      <Wrapper isSmall={isSmall} {...props}>
        <Gravatar email={email} size={isSmall ? 30 : 40} />
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

export default Avatar;
