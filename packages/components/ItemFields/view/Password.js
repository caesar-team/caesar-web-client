import React, { useState } from 'react';
import zxcvbn from 'zxcvbn';
import styled from 'styled-components';
import { TooltipPasswordGenerator } from '../../TooltipPasswordGenerator';
import { PasswordIndicator } from '../../PasswordIndicator';
import { HoldClickBehaviour } from '../../HoldClickBehaviour';
import { Icon } from '../../Icon';
import { Input } from './Input';

const StyledTooltipPasswordGenerator = styled(TooltipPasswordGenerator)`
  margin-left: 16px;
`;

const StyledInput = styled(Input)`
  ${Input.InputField} {
    padding-right: 236px;
  }
`;

const EyeIcon = styled(Icon)`
  margin-left: 16px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
`;

export const Password = ({
  value: propValue,
  itemSubject,
  schema,
  onClickAcceptEdit,
}) => {
  const [isVisible, setVisible] = useState(false);
  const [value, setValue] = useState(propValue);

  const handleGeneratePassword = set => password => {
    set(password);
  };

  const handleHoldStart = () => {
    setVisible(true);
  };
  const handleHoldEnd = () => {
    setVisible(false);
  };

  const handleChange = val => {
    setValue(val);
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
      value={value}
      itemSubject={itemSubject}
      schema={schema}
      originalValue={propValue}
      onClickAcceptEdit={onClickAcceptEdit}
      onChange={handleChange}
      addonPostfix={
        <>
          {value && <PasswordIndicator score={zxcvbn(value).score} />}
          <StyledTooltipPasswordGenerator
            tooltipProps={{ position: 'left center', textBoxWidth: '230px' }}
            onGeneratePassword={handleGeneratePassword(setValue)}
          />
          {eyeIcon}
        </>
      }
      addonIcons={
        <>
          {value && <PasswordIndicator score={zxcvbn(value).score} />}
          {eyeIcon}
        </>
      }
    />
  );
};
