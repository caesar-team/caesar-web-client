import React from 'react';
import styled from 'styled-components';

const DefaultRadio = styled.input`
  display: none;
`;

const RadioIcon = styled.div`
  position: relative;
  flex: 0 0 16px;
  width: 16px;
  height: 16px;
  background-color: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.lightGray};
  border-radius: 50%;

  &::after {
    position: absolute;
    top: 50%;
    left: 50%;
    display: none;
    width: 12px;
    height: 12px;
    content: '';
    background-color: ${({ theme }) => theme.color.black};
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }

  ${DefaultRadio}:checked + & {
    &::after {
      display: block;
    }
  }
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  margin-left: 16px;
  transition: all 0.2s;

  ${DefaultRadio}:checked ~ & {
    font-weight: 600;
  }
`;

const Wrapper = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    user-select: none;

    ${Label} {
      font-weight: 600;
    }
  }
`;

const Radio = ({ label, disabled, className, value, name, onChange }) => (
  <Wrapper disabled={disabled} className={className}>
    <DefaultRadio
      type="radio"
      name={name}
      value={value}
      disabled={disabled}
      onChange={onChange}
    />
    <RadioIcon disabled={disabled} />
    <Label>{label}</Label>
  </Wrapper>
);

Radio.Label = Label;
Radio.RadioIcon = RadioIcon;

export { Radio };
