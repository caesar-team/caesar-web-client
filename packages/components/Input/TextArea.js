import React, { useRef } from 'react';
import { useUpdateEffect } from 'react-use';
import styled from 'styled-components';
import { TextError } from '../Error';

const Label = styled.label`
  position: relative;
  display: block;
  width: 100%;
`;

const LabelText = styled.div`
  padding: 0 16px;
  margin-bottom: 8px;
  font-size: ${({ theme }) => theme.font.size.small};
  color: ${({ theme }) => theme.color.gray};
`;

const TextAreaField = styled.textarea`
  padding: 8px 16px;
  display: block;
  width: 100%;
  min-height: 112px;
  font-size: ${({ theme }) => theme.font.size.main};
  line-height: ${({ theme }) => theme.font.lineHeight.main};
  letter-spacing: inherit;
  color: ${({ theme }) => theme.color.black};
  background-color: ${({ theme }) => theme.color.snow};
  border: 1px solid ${({ theme }) => theme.color.gallery};
  border-radius: ${({ theme }) => theme.borderRadius};
  outline: none;
  resize: none;
  transition: border-color 0.2s, background-color 0.2s;

  &:hover:not(:focus) {
    border-color: ${({ theme }) => theme.color.black};
  }

  &:focus {
    background-color: ${({ theme }) => theme.color.alto};
    border-color: ${({ theme }) => theme.color.alto};
  }

  &::placeholder {
    color: ${({ theme }) => theme.color.lightGray};
  }
`;

const TextArea = ({
  className,
  error,
  label,
  value,
  placeholder = 'Write here something…',
  isFocused,
  isDisabled,
  ...props
}) => {
  const textareaRef = useRef(null);
  const isError = !!error;

  useUpdateEffect(() => {
    if (isFocused) {
      return textareaRef?.current?.focus();
    }
  }, [isFocused]);

  return (
    <Label className={className}>
      {label && <LabelText>{label}</LabelText>}
      <TextAreaField
        isError={isError}
        value={value}
        placeholder={placeholder}
        ref={textareaRef}
        disabled={isDisabled}
        {...props}
      />
      {error && <TextError marginTop={8}>{error}</TextError>}
    </Label>
  );
};

TextArea.TextAreaField = TextAreaField;

export { TextArea };
