import React from 'react';
import styled from 'styled-components';
import { CircleLoader } from '../Loader';

const Wrapper = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InputContainer = styled.label`
  position: relative;
  display: inline-block;
  width: 36px;
  height: 16px;
  > input {
    display: none;
  }
`;

const Input = styled.input`
  &:checked + span {
    background-color: ${({ theme }) => theme.color.black};
  }
  &:disabled + span {
    background-color: ${({ theme }) => theme.color.gray};
    opacity: 0.4;
    cursor: not-allowed;
  }
  &:disabled:checked + span {
    background-color: ${({ theme }) => theme.color.black};
    opacity: 0.4;
    cursor: not-allowed;
  }
  &:focus + span {
    box-shadow: 0 0 1px #2196f3;
  }
  &:checked + span:before {
    -webkit-transform: translateX(20px);
    -ms-transform: translateX(18px);
    transform: translateX(pxpx);
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  display: flex;
  align-items: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.color.gray};
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 34px;

  ${({ isLoading, theme }) =>
    !isLoading &&
    `
    &::before {
      position: relative;
      border-radius: 50%;
      content: '';
      height: 16px;
      width: 16px;
      background-color: ${theme.color.white};
      -webkit-transition: 0.4s;
      transition: 0.4s;
    }
  `};
`;

const Toggle = ({ onChange, checked, disabled, name, isLoading, ...props }) => (
  <Wrapper>
    <InputContainer>
      <Input
        {...props}
        type="checkbox"
        name={name}
        checked={checked}
        disabled={disabled || isLoading}
        onChange={onChange}
      />
      <Slider isLoading={isLoading}>
        {isLoading && <CircleLoader size={20} color="white" />}
      </Slider>
    </InputContainer>
  </Wrapper>
);

export default Toggle;
