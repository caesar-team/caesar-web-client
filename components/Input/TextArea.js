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

const TextAreaField = styled.textarea`
  padding: 7px 15px;
  display: block;
  width: 100%;
  font-size: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.black};
  border: 1px solid ${({ theme }) => theme.gallery};
  border-radius: 3px;
  background-color: ${({ theme }) => theme.snow};
  outline: none;
  min-height: 120px;
  resize: none;

  &::placeholder {
    color: ${({ theme }) => theme.lightGray};
  }
`;

const Error = styled.div`
  margin-top: 8px;
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.red};
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
