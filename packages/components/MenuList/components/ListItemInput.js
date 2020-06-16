import React, { useRef } from 'react';
import { useClickAway } from 'react-use';
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

export const ListItemInput = ({
  isEditMode,
  setIsEditMode,
  isCreatingMode,
  setIsCreatingMode,
  value,
  setValue,
  label,
  handleClickAcceptEdit,
  handleClickClose,
}) => {
  const inputRef = useRef(null);

  useClickAway(inputRef, () => {
    if (isEditMode) {
      setIsEditMode(false);

      if (isCreatingMode) {
        setIsCreatingMode(false);
      }
    }
  });

  const handleInputChange = e => {
    const newValue = e.target.value;

    if (newValue.length >= MAX_LIST_LABEL_LENGTH) return;

    setValue(newValue);
  };

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
              onClick={handleClickAcceptEdit}
            />
            <StyledIcon
              name="close"
              width={12}
              height={12}
              color="gray"
              onClick={handleClickClose}
            />
          </>
        }
      />
    </div>
  );
};
