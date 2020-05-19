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
  color: ${({ theme }) => theme.color.black};
`;

const TextAreaField = styled.textarea`
  padding: 7px 15px;
  display: block;
  width: 100%;
  font-size: 16px;
  line-height: 1.5;
  color: ${({ theme }) => theme.color.black};
  border: 1px solid ${({ theme }) => theme.color.gallery};
  border-radius: 3px;
  background-color: ${({ theme }) => theme.color.snow};
  outline: none;
  min-height: 112px;
  resize: none;

  &::placeholder {
    color: ${({ theme }) => theme.color.lightGray};
  }
`;

const Error = styled.div`
  margin-top: 8px;
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.color.red};
`;

const TextArea = ({
  children,
  className,
  error,
  value,
  placeholder = 'Write here something…',
  ...props
}) => {
  const isError = !!error;

  return (
    <Label className={className}>
      {children && <LabelText>{children}</LabelText>}
      <TextAreaField
        isError={isError}
        value={value}
        placeholder={placeholder}
        {...props}
      />
      {error && <Error>{error}</Error>}
    </Label>
  );
};

TextArea.TextAreaField = TextAreaField;

export default TextArea;
