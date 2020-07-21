import React, { useRef } from 'react';
import { useClickAway, useKeyPressEvent } from 'react-use';
import styled from 'styled-components';
import { Icon } from '../../Icon';
import { Input } from '../../Input';

const StyledInput = styled(Input)`
  ${Input.InputField} {
    padding-right: 80px;
  }
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

const MAX_LIST_LABEL_LENGTH = 75;

export const ListInput = ({
  isEditMode,
  setEditMode,
  isCreatingMode,
  setCreatingMode,
  value,
  setValue,
  label,
  onClickAcceptEdit,
  onClickClose,
}) => {
  const inputRef = useRef(null);

  useClickAway(inputRef, () => {
    if (isEditMode) {
      setEditMode(false);

      if (isCreatingMode) {
        setCreatingMode(false);
      }
    }
  });

  const handleInputChange = e => {
    const newValue = e.target.value;

    if (
      value?.length >= MAX_LIST_LABEL_LENGTH &&
      newValue.length >= MAX_LIST_LABEL_LENGTH
    )
      return;

    setValue(newValue.slice(0, MAX_LIST_LABEL_LENGTH));
  };

  useKeyPressEvent('Enter', onClickAcceptEdit);
  useKeyPressEvent('Escape', onClickClose);

  return (
    <div ref={inputRef}>
      <StyledInput
        autoFocus
        value={value}
        onChange={handleInputChange}
        postfix={
          <>
            <StyledIcon
              name="checkmark"
              width={16}
              height={16}
              color="gray"
              isDisabled={!value || value === label}
              onClick={onClickAcceptEdit}
            />
            <StyledIcon
              name="close"
              width={16}
              height={16}
              color="gray"
              onClick={onClickClose}
            />
          </>
        }
      />
    </div>
  );
};
