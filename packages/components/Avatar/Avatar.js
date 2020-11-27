import React from 'react';
import { API_URI } from '@caesar/common/constants';
import { Hint } from '../Hint';
import { Wrapper, Image } from './styles';

export const Avatar = ({
  name,
  email,
  avatar,
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
