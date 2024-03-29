import React, { useState, useRef, memo } from 'react';
import { useClickAway, useKeyPressEvent } from 'react-use';
import styled from 'styled-components';
import { Icon } from '../Icon';
import { TextError } from '../Error';

const Label = styled.label`
  display: block;
  position: relative;
  width: 100%;
`;

const LabelText = styled.div`
  position: absolute;
  top: ${({ isFocused, value }) => (isFocused || value ? '-20px' : '9px')};
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
    color: ${({ theme }) => theme.color.lightGray};
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
`;

const PostFix = styled.div`
  position: absolute;
  top: 50%;
  right: 16px;
  display: flex;
  align-items: center;
  line-height: 0;
  transform: translateY(-50%);
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

const Error = styled(TextError)`
  padding-left: 16px;
`;

const InputComponent = ({
  type = 'text',
  label,
  name,
  value,
  autoComplete = 'chrome-off',
  error,
  prefix,
  postfix,
  withBorder,
  onBlur,
  isAcceptIconDisabled,
  onClickAcceptEdit,
  onClickClose,
  onClickAway = Function.prototype,
  className,
  ...props
}) => {
  const inputRef = useRef(null);
  const [isFocused, setFocused] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = e => {
    setFocused(false);

    if (onBlur) {
      onBlur(e);
    }
  };

  useClickAway(inputRef, onClickAway);
  useKeyPressEvent('Enter', onClickAcceptEdit);
  useKeyPressEvent('Escape', onClickClose);

  return (
    <>
      <Label ref={inputRef} className={className}>
        {label && (
          <LabelText isFocused={isFocused} value={value}>
            {label}
          </LabelText>
        )}
        {prefix && <Prefix>{prefix}</Prefix>}
        <InputField
          {...props}
          autoComplete={autoComplete}
          type={type}
          name={name}
          value={value}
          isError={!!error}
          isFocused={isFocused}
          withBorder={withBorder}
          withIcons={onClickAcceptEdit || onClickClose}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {(postfix || onClickAcceptEdit || onClickClose) && (
          <PostFix>
            {postfix}
            {onClickAcceptEdit && (
              <StyledIcon
                name="checkmark"
                width={16}
                height={16}
                color="gray"
                isDisabled={isAcceptIconDisabled}
                onClick={onClickAcceptEdit}
              />
            )}
            {onClickClose && (
              <StyledIcon
                name="close"
                width={16}
                height={16}
                color="gray"
                onClick={onClickClose}
              />
            )}
          </PostFix>
        )}
      </Label>
      {error && <Error>{error}</Error>}
    </>  
  );
};

const Input = memo(InputComponent);

Input.InputField = InputField;
Input.Prefix = Prefix;
Input.PostFix = PostFix;

export { Input };
