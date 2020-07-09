import React, { useState } from 'react';
import styled from 'styled-components';
import { HoldClickBehaviour } from '../../HoldClickBehaviour';
import { Icon } from '../../Icon';
import { Input } from './Input';

const EyeIcon = styled(Icon)`
  margin-left: 16px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
`;

export const Password = ({ value, onClickAcceptEdit }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleHoldStart = () => {
    setIsVisible(true);
  };
  const handleHoldEnd = () => {
    setIsVisible(false);
  };

  const eyeIcon = (
    <HoldClickBehaviour onHoldStart={handleHoldStart} onHoldEnd={handleHoldEnd}>
      <EyeIcon
        name={isVisible ? 'eye-off' : 'eye-on'}
        color="gray"
        width={20}
        height={20}
      />
    </HoldClickBehaviour>
  );

  return (
    <Input
      type={isVisible ? 'text' : 'password'}
      label="Password"
      name="pass"
      autoComplete="new-password"
      value={isVisible ? value : '********'}
      originalValue={value}
      onClickAcceptEdit={onClickAcceptEdit}
      addonPostfix={eyeIcon}
      addonIcons={eyeIcon}
    />
  );
};
