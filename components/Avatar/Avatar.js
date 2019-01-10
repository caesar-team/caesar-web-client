import React from 'react';
import styled from 'styled-components';
import { API_URL } from 'common/constants';

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
  width: 40px;
  height: 40px;
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

const Avatar = ({ name, avatar, children }) => {
  if (children) {
    return <Wrapper>{children}</Wrapper>;
  }

  if (avatar) {
    return (
      <Wrapper>
        <Image src={`${API_URL}/${avatar}`} />
      </Wrapper>
    );
  }

  const personLetters = name ? name.slice(0, 2).toUpperCase() : '';

  return <Wrapper>{personLetters}</Wrapper>;
};

export default Avatar;
