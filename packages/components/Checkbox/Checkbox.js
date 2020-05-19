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
  // if checkbox is used inside Tooltip, this one affects display position to block
  display: flex !important;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.color.white};
  border: 1px solid
    ${({ isChecked, theme }) =>
      isChecked ? theme.color.black : theme.color.gallery};
  border-radius: 2px;
  background-color: ${({ isChecked, theme }) =>
    isChecked ? theme.color.black : theme.color.white};
  transition: 0.3s;
  ${({ isFocused, theme }) =>
    isFocused && `border-color: ${theme.color.black}`};
`;

const Text = styled.span`
  padding-left: 16px;
  line-height: 1.5;
  color: ${({ theme, isDisabled }) => isDisabled && theme.color.gray};
`;

const StyledInput = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
`;

const Checkbox = ({ isDisabled, children, checked, className, ...props }) => (
  <StyledLabel isDisabled={isDisabled} className={className}>
    <Box isChecked={checked}>
      <Icon name="checkmark" width={14} height={10} />
    </Box>
    <StyledInput
      type="checkbox"
      disabled={isDisabled}
      checked={checked}
      {...props}
    />
    {children && <Text isDisabled={isDisabled}>{children}</Text>}
  </StyledLabel>
);

Checkbox.Text = Text;
Checkbox.Box = Box;

export default Checkbox;
