import React from 'react';
import styled from 'styled-components';
import { Icon } from '../Icon';

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;

  pointer-events: ${({ isDisabled }) => isDisabled && 'none'};
`;

const Box = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.white};
  border: 1px solid
    ${({ isChecked, theme }) => (isChecked ? theme.black : theme.gallery)};
  border-radius: 2px;
  background-color: ${({ isChecked, theme }) =>
    isChecked ? theme.black : theme.white};
  transition: 0.3s;
  ${({ isFocused, theme }) => isFocused && `border-color: ${theme.black}`};
`;

const Text = styled.span`
  padding-left: 10px;
  color: ${({ theme, isDisabled }) => isDisabled && theme.gray};
`;

const StyledInput = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
`;

const Checkbox = ({ isDisabled, checked, children, ...props }) => (
  <StyledLabel isDisabled={isDisabled}>
    <Box isChecked={checked}>
      <Icon name="check" isInButton width={14} height={10} />
    </Box>
    <StyledInput
      type="checkbox"
      checked={checked}
      disabled={isDisabled}
      {...props}
    />
    {children && <Text isDisabled={isDisabled}>{children}</Text>}
  </StyledLabel>
);

export default Checkbox;
