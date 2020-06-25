import React, { useState } from 'react';
import styled from 'styled-components';
import { HoldClickBehaviour } from '../HoldClickBehaviour';
import { Icon } from '../Icon';
import { Input } from './Input';

const EyeIcon = styled(Icon)`
  margin-left: 16px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
`;

export const Password = ({ value }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleHoldStart = () => {
    setIsVisible(true);
  };
  const handleHoldEnd = () => {
    setIsVisible(false);
  };

  return (
    <Input
      label="Password"
      value={isVisible ? value : '********'}
      addonIcons={
        <HoldClickBehaviour
          onHoldStart={handleHoldStart}
          onHoldEnd={handleHoldEnd}
        >
          <EyeIcon
            name={isVisible ? 'eye-off' : 'eye-on'}
            color="gray"
            width={20}
            height={20}
          />
        </HoldClickBehaviour>
      }
    />
  );
};
