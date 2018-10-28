import React from 'react';
import styled from 'styled-components';
import { Avatar as AntdAvatar } from 'antd';
import { API_URL } from 'common/constants';

const StyledAvatar = styled(AntdAvatar)`
  margin-left: -16px;
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  font-size: 15px;
  border: 2px solid #fff;

  &:first-child {
    margin-left: 0;
  }

  .ant-avatar-string {
    line-height: ${({ size }) => `${size}px`};
  }
`;

const Avatar = ({ name, avatar, size = 40, children }) => {
  if (children) {
    return <StyledAvatar>{children}</StyledAvatar>;
  }

  if (avatar) {
    return <StyledAvatar size={size} src={`${API_URL}/${avatar}`} />;
  }

  const personLetters = name ? name.slice(0, 2).toUpperCase() : '';

  return <StyledAvatar size={size}>{personLetters}</StyledAvatar>;
};

export default Avatar;
