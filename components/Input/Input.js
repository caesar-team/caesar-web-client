import React from 'react';
import styled from 'styled-components';

const Label = styled.label`
  display: block;
  position: relative;
  width: 100%;
`;

const LabelText = styled.div`
  margin-bottom: 15px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.black};
`;

const InputField = styled.input`
  padding: 18px 20px;
  display: block;
  width: 100%;
  font-size: 18px;
  letter-spacing: 0.6px;
  background-color: #fff;
  border: none;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.gray};
  }
`;

const Prefix = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  line-height: 0;
  left: 16px;
`;

const PostFix = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  line-height: 0;
  right: 25px;
`;

const Error = styled.div`
  margin-top: 8px;
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.red};
`;

function Input({
  children,
  className,
  error,
  value,
  prefix,
  postfix,
  ...props
}) {
  const isError = !!error;

  return (
    <Label className={className}>
      {children && <LabelText>{children}</LabelText>}
      {prefix && <Prefix>{prefix}</Prefix>}
      <InputField isError={isError} value={value} {...props} />
      {postfix && <PostFix>{postfix}</PostFix>}
      {error && <Error>{error}</Error>}
    </Label>
  );
}

Input.InputField = InputField;
Input.PostFix = PostFix;

export default Input;
