import React from 'react';
import styled from 'styled-components';
import { API_URI } from 'common/constants';

const Wrapper = styled.div`
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  list-style: none;
  display: inline-block;
  text-align: center;
  background: ${({ theme }) => theme.gray};
  color: ${({ theme }) => theme.white};
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  vertical-align: middle;
  width: ${({ isSmall }) => (isSmall ? '30px' : '40px')};
  height: ${({ isSmall }) => (isSmall ? '30px' : '40px')};
  line-height: 40px;
  border-radius: 50%;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  vertical-align: middle;
  border-style: none;
`;

const Avatar = ({ name, avatar, children, isSmall, ...props }) => {
  if (children) {
    return <Wrapper {...props}>{children}</Wrapper>;
  }

  if (avatar) {
    return (
      <Wrapper isSmall={isSmall} {...props}>
        <Image src={`${API_URI}/${avatar}`} />
      </Wrapper>
    );
  }

  const personLetters = name ? name.slice(0, 2).toUpperCase() : '';

  return <Wrapper {...props}>{personLetters}</Wrapper>;
};

export default Avatar;
