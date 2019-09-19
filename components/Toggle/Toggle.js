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
  width: 40px;
  height: 20px;
  > input {
    display: none;
  }
`;

const Input = styled.input`
  &:checked + span {
    background-color: ${({ theme }) => theme.black};
  }
  &:disabled + span {
    background-color: ${({ theme }) => theme.gray};
    opacity: 0.4;
    cursor: not-allowed;
  }
  &:disabled:checked + span {
    background-color: ${({ theme }) => theme.black};
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
  background-color: ${({ theme }) => theme.gray};
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 34px;

  ${({ isLoading, theme }) =>
    !isLoading &&
    `
    &:before {
      position: relative;
      border-radius: 50%;
      content: '';
      height: 20px;
      width: 20px;
      background-color: ${theme.white};
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
