import React from 'react';
import styled from 'styled-components';
import { API_URI } from '@caesar/common/constants';
import { Hint } from '../Hint';
import { Icon } from '../Icon';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ size }) => size}px;
  min-width: ${({ size }) => size}px;
  flex: 0 0 ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  padding: 0;
  margin: 0;
  overflow: hidden;
  font-size: ${({ fontSize, theme }) => theme.font.size[fontSize]};
  color: ${({ theme }) => theme.color.white};
  white-space: nowrap;
  text-align: center;
  background-color: ${({ theme }) => theme.color.gray};
  border-radius: 50%;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  border-style: none;
`;

export const Avatar = ({
  name,
  email,
  avatar,
  accessGranted,
  children,
  size = 40,
  fontSize = 'main',
  hint = '',
  hintPosition = 'center',
  ...props
}) => {
  const renderInner = () => {
    switch (true) {
      case !!children:
        return children;

      case !accessGranted: {
        return <Icon name="warning" width={40} height={40} color="black" />;
      }

      case !!avatar: {
        const avatarIcon = avatar.startsWith('data:')
          ? avatar
          : `${API_URI}/${avatar}`;

        return <Image src={avatarIcon} />;
      }

      default: {
        const personLetters = name
          ? name.slice(0, 2).toUpperCase()
          : email?.slice(0, 2).toUpperCase();

        return personLetters;
      }
    }
  };

  return (
    <Hint text={hint} position={hintPosition}>
      <Wrapper size={size} fontSize={fontSize} {...props}>
        {renderInner()}
      </Wrapper>
    </Hint>
  );
};
