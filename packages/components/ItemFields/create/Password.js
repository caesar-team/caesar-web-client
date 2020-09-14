import React from 'react';
import zxcvbn from 'zxcvbn';
import styled from 'styled-components';
import { PasswordInput } from '../../Input';
import { PasswordIndicator } from '../../PasswordIndicator';

const StyledPasswordInput = styled(PasswordInput)`
  ${PasswordInput.InputField} {
    ${({ value }) => value && 'padding-right: 138px'}
  }
`;

const StyledPasswordIndicator = styled(PasswordIndicator)`
  margin-right: 16px;
`;

const Password = ({ value, ...props }) => (
  <StyledPasswordInput
    value={value}
    addonPostfix={
      value && <StyledPasswordIndicator score={zxcvbn(value).score} />
    }
    {...props}
  />
);

export { Password };
