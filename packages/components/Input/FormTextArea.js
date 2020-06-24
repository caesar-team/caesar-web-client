import React, { useRef } from 'react';
import { useClickAway, useKeyPressEvent } from 'react-use';
import styled from 'styled-components';
import { Icon } from '../Icon';
import { TextArea } from './TextArea';

const Wrapper = styled.div`
  position: relative;
`;

const StyledTextArea = styled(TextArea)`
  ${TextArea.TextAreaField} {
    padding-bottom: 32px;
  }
`;

const IconsWrapper = styled.div`
  position: absolute;
  right: 1px;
  bottom: 1px;
  left: 1px;
  display: flex;
  justify-content: flex-end;
  padding: 8px 16px;
  background: rgba(245, 245, 245, 0.96);
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

const FormTextArea = ({
  label,
  value,
  placeholder,
  isAcceptIconDisabled,
  handleChange = Function.prototype,
  handleFocus = Function.prototype,
  handleClickAcceptEdit = Function.prototype,
  handleClickClose = Function.prototype,
  handleClickAway = Function.prototype,
  className,
}) => {
  const textareaRef = useRef(null);

  useClickAway(textareaRef, handleClickAway);
  useKeyPressEvent('Enter', handleClickAcceptEdit);
  useKeyPressEvent('Escape', handleClickClose);

  return (
    <Wrapper ref={textareaRef} className={className}>
      <StyledTextArea
        label={label}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onFocus={handleFocus}
      />
      <IconsWrapper>
        <StyledIcon
          name="checkmark"
          width={16}
          height={16}
          color="gray"
          isDisabled={isAcceptIconDisabled}
          onClick={handleClickAcceptEdit}
        />
        <StyledIcon
          name="close"
          width={16}
          height={16}
          color="gray"
          onClick={handleClickClose}
        />
      </IconsWrapper>
    </Wrapper>
  );
};

FormTextArea.TextAreaField = TextArea.TextAreaField;
FormTextArea.IconsWrapper = IconsWrapper;

export { FormTextArea };
