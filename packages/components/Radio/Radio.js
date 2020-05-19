import React from 'react';
import styled from 'styled-components';

const Label = styled.label`
  position: relative;
  padding-left: 20px;
  min-height: 20px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-size: 14px;
  color: ${({ theme }) => theme.color.black};

  &:hover {
    user-select: none;
  }

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    content: '';
    width: 20px;
    height: 20px;
    background-color: #fff;
    border: 1px solid ${({ theme }) => theme.color.black};
    border-radius: 50%;
  }
`;

const RadioIcon = styled.div`
  position: absolute;
  top: 3px;
  left: 3px;
  width: 14px;
  height: 14px;
  background-color: ${({ theme, checked }) =>
    checked ? theme.color.black : theme.color.white};
  border-radius: 50%;
  z-index: 1;
`;

const StyledInput = styled.input`
  height: 0;
  width: 0;
  opacity: 0;
  overflow: hidden;
  position: absolute;
`;

const Radio = ({ children, disabled, checked, className, value, onChange }) => {
  return (
    <Label className={className} disabled={disabled}>
      {children}
      <StyledInput
        type="radio"
        value={value}
        disabled={disabled}
        checked={checked}
        onChange={onChange}
      />
      <RadioIcon disabled={disabled} checked={checked} />
    </Label>
  );
};

Radio.Label = Label;
Radio.RadioIcon = RadioIcon;

export default Radio;
