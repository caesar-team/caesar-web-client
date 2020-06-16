import React from 'react';
import styled from 'styled-components';
import { Icon } from '../Icon';

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  pointer-events: ${({ isDisabled }) => isDisabled && 'none'};
`;

const StyledInput = styled.input`
  display: none;
`;

const Box = styled.span`
  /* if checkbox is used inside Tooltip, this one affects display position to block */
  display: flex !important;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.gallery};
  border-radius: 2px;
  background-color: ${({ theme }) => theme.color.white};
  transition: 0.3s;
  ${({ isFocused, theme }) =>
    isFocused && `border-color: ${theme.color.black}`};

  ${StyledInput}:checked + & {
    background-color: ${({ theme }) => theme.color.black};
    border: 1px solid ${({ theme }) => theme.color.black};
  }
`;

const Text = styled.span`
  padding-left: 16px;
  line-height: 1.5;
  color: ${({ theme, isDisabled }) => isDisabled && theme.color.gray};
`;

const Checkbox = ({ isDisabled, children, checked, className, ...props }) => (
  <StyledLabel isDisabled={isDisabled} className={className}>
    <StyledInput
      type="checkbox"
      disabled={isDisabled}
      checked={checked}
      {...props}
    />
    <Box>
      <Icon name="checkmark" width={14} height={10} />
    </Box>
    {children && <Text isDisabled={isDisabled}>{children}</Text>}
  </StyledLabel>
);

Checkbox.Text = Text;
Checkbox.Box = Box;
Checkbox.Input = StyledInput;

export default Checkbox;
