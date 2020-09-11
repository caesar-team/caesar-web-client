import React from 'react';
import zxcvbn from 'zxcvbn';
import styled from 'styled-components';
import { TooltipPasswordGenerator } from '../../TooltipPasswordGenerator';
import { PasswordInput } from '../../Input';
import { PasswordIndicator } from '../../PasswordIndicator';

const StyledTooltipPasswordGenerator = styled(TooltipPasswordGenerator)`
  margin-right: 8px;
`;

const StyledPasswordInput = styled(PasswordInput)`
  ${PasswordInput.InputField} {
    ${({ value }) => value && 'padding-right: 138px'}
  }
`;

const StyledPasswordIndicator = styled(PasswordIndicator)`
  margin-right: 8px;
`;

const Password = ({ name, value, setFieldValue, ...props }) => {
  const handleGeneratePassword = setValue => password =>
    setValue(name, password);

  return (
    <>
      <StyledPasswordInput
        name={name}
        value={value}
        addonPostfix={
          <>
            {value && <StyledPasswordIndicator score={zxcvbn(value).score} />}
            <StyledTooltipPasswordGenerator
              onGeneratePassword={handleGeneratePassword(setFieldValue)}
              tooltipProps={{ position: 'left center' }}
            />
          </>
        }
        {...props}
      />
    </>
  );
};

export { Password };
