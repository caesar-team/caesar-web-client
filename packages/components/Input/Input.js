import React, { useState, useRef } from 'react';
import { useClickAway, useKeyPressEvent } from 'react-use';
import styled from 'styled-components';
import { Icon } from '../Icon';

const Label = styled.label`
  display: block;
  position: relative;
  width: 100%;
`;

const LabelText = styled.div`
  position: absolute;
  top: ${({ isFocused, value }) => (isFocused || value ? '-20px' : '5px')};
  left: 16px;
  z-index: ${({ theme }) => theme.zIndex.basic};
  font-size: ${({ isFocused, value, theme }) =>
    isFocused || value ? theme.font.size.small : theme.font.size.main};
  color: ${({ theme }) => theme.color.gray};
  transition: all 0.2s;
`;

const InputField = styled.input`
  padding: 9px 16px;
  display: block;
  width: 100%;
  font-size: ${({ theme }) => theme.font.size.main};
  line-height: ${({ theme }) => theme.font.lineHeight.main};
  letter-spacing: inherit;
  background-color: ${({ theme, isFocused }) =>
    isFocused ? theme.color.snow : theme.color.white};
  border: none;
  border-bottom: ${({ theme, withBorder, isFocused }) =>
    withBorder && !isFocused
      ? `1px solid ${theme.color.gallery}`
      : '1px solid transparent'};
  outline: none;

  ${({ withIcons }) => withIcons && 'padding-right: 80px;'}

  &::placeholder {
    padding: 5px 0;
    color: ${({ theme }) => theme.color.gray};
    letter-spacing: inherit;
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-transition: 'color 9999s ease-out, background-color 9999s ease-out';
    -webkit-transition-delay: 9999s;
  }

  &::-webkit-credentials-auto-fill-button {
    visibility: hidden;
  }
`;

const Prefix = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  line-height: 0;
  left: 16px;
  background-color: ${({ theme }) => theme.color.white};
`;

const PostFix = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  line-height: 0;
  right: 16px;
  background-color: ${({ theme }) => theme.color.white};
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

const Error = styled.div`
  padding-left: 15px;
  margin-top: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.color.red};
`;

const Input = ({
  type = 'text',
  label,
  name,
  value,
  error,
  prefix,
  postfix,
  withBorder,
  onBlur,
  isAcceptIconDisabled,
  handleClickAcceptEdit,
  handleClickClose,
  handleClickAway = Function.prototype,
  children,
  className,
  ...props
}) => {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);

    if (onBlur) {
      onBlur(name, true);
    }
  };

  useClickAway(inputRef, handleClickAway);
  useKeyPressEvent('Enter', handleClickAcceptEdit);
  useKeyPressEvent('Escape', handleClickClose);

  return (
    <Label ref={inputRef} className={className}>
      {label && (
        <LabelText isFocused={isFocused} value={value}>
          {label}
        </LabelText>
      )}
      {prefix && <Prefix>{prefix}</Prefix>}
      <InputField
        {...props}
        autoComplete="off"
        type={type}
        name={name}
        value={value}
        isError={!!error}
        isFocused={isFocused}
        withBorder={withBorder}
        withIcons={handleClickAcceptEdit || handleClickClose}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {(postfix || handleClickAcceptEdit || handleClickClose) && (
        <PostFix>
          {handleClickAcceptEdit && (
            <StyledIcon
              name="checkmark"
              width={16}
              height={16}
              color="gray"
              isDisabled={isAcceptIconDisabled}
              onClick={handleClickAcceptEdit}
            />
          )}
          {handleClickClose && (
            <StyledIcon
              name="close"
              width={16}
              height={16}
              color="gray"
              onClick={handleClickClose}
            />
          )}
          {postfix}
        </PostFix>
      )}
      {error && <Error>{error}</Error>}
    </Label>
  );
};

Input.InputField = InputField;
Input.Prefix = Prefix;
Input.PostFix = PostFix;

export { Input };
