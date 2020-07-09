import React, { useRef } from 'react';
import { useClickAway, useKeyPressEvent } from 'react-use';
import styled from 'styled-components';
import { Icon } from '../Icon';
import Input from './Input';

const StyledInput = styled(Input)`
  ${Input.InputField} {
    padding-right: 80px;
  }
`;

const StyledIcon = styled(Icon)`
  margin-left: 16px;
  transition: color 0.2s, opacity 0.2s;
  cursor: pointer;

  ${({ isDisabled }) =>
    isDisabled &&
    `
      pointer-events: none;
      opacity: 0.2;
    `}

  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
`;

const FormInput = ({
  label,
  value,
  placeholder,
  isAcceptIconDisabled,
  handleChange = Function.prototype,
  handleClickAcceptEdit = Function.prototype,
  handleClickClose = Function.prototype,
  handleClickAway = Function.prototype,
  withBorder,
  className,
}) => {
  const inputRef = useRef(null);

  useClickAway(inputRef, handleClickAway);
  useKeyPressEvent('Enter', handleClickAcceptEdit);
  useKeyPressEvent('Escape', handleClickClose);

  return (
    <div ref={inputRef} className={className}>
      <StyledInput
        autoFocus
        label={label}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        postfix={
          <>
            <StyledIcon
              name="checkmark"
              width={16}
              height={16}
              color="gray"
              isDisabled={isAcceptIconDisabled}
              onClick={handleClickAcceptEdit}
            />
            <StyledIcon
              name="close"
              width={16}
              height={16}
              color="gray"
              onClick={handleClickClose}
            />
          </>
        }
        withBorder={withBorder}
      />
    </div>
  );
};

FormInput.InputField = Input.InputField;

export { FormInput };
