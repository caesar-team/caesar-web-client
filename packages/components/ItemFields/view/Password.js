import React, { useState } from 'react';
import zxcvbn from 'zxcvbn';
import styled from 'styled-components';
import { PasswordIndicator } from '../../PasswordIndicator';
import { HoldClickBehaviour } from '../../HoldClickBehaviour';
import { Icon } from '../../Icon';
import { Input } from './Input';

const StyledInput = styled(Input)`
  ${Input.InputField} {
    padding-right: 104px;
  }
`;

const EyeIcon = styled(Icon)`
  margin-left: 16px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
`;

export const Password = ({ value, itemSubject, schema, onClickAcceptEdit }) => {
  const [isVisible, setVisible] = useState(false);

  const handleHoldStart = () => {
    setVisible(true);
  };
  const handleHoldEnd = () => {
    setVisible(false);
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
    <StyledInput
      type={isVisible ? 'text' : 'password'}
      label="Password"
      name="pass"
      autoComplete="new-password"
      value={isVisible ? value : '********'}
      itemSubject={itemSubject}
      schema={schema}
      originalValue={value}
      onClickAcceptEdit={onClickAcceptEdit}
      addonPostfix={eyeIcon}
      addonIcons={
        <>
          {value && <PasswordIndicator score={zxcvbn(value).score} />}
          {eyeIcon}
        </>
      }
    />
  );
};
