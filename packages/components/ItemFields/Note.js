import React, { useState } from 'react';
import styled from 'styled-components';
import { Icon } from '../Icon';
import { FormTextArea } from '../Input';
import { Button } from '../Button';

const Wrapper = styled.div`
  position: relative;
`;

const StyledFormTextArea = styled(FormTextArea)`
  ${FormTextArea.IconsWrapper} {
    ${({ isEdit }) => !isEdit && 'display: none;'}
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

const AddBtn = styled(Button)`
  margin-left: auto;
  font-size: ${({ theme }) => theme.font.size.main};
`;

export const Note = ({ value: propValue, handleClickAcceptEdit }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState(propValue);

  const handleClickAdd = () => {
    setIsEdit(true);
  };

  const handleClickEdit = () => {
    setIsEdit(true);
    setIsFocused(true);
  };

  const handleDeleteNote = () => {
    handleClickAcceptEdit({ name: 'note', value: '' });
  };

  return (
    <Wrapper>
      {propValue || isEdit ? (
        <>
          <StyledFormTextArea
            label="Notes"
            value={value}
            handleChange={e => setValue(e.target.value)}
            handleFocus={handleClickAcceptEdit && (() => setIsEdit(true))}
            handleClickAcceptEdit={() => {
              handleClickAcceptEdit({ name: 'note', value });
              setIsEdit(false);
            }}
            handleClickAway={() => setIsEdit(false)}
            handleClickClose={() => setIsEdit(false)}
            isFocused={isFocused}
            isEdit={isEdit}
            isDisabled={!handleClickAcceptEdit}
          />
          {!isEdit && handleClickAcceptEdit && (
            <>
              <IconsWrapper>
                <StyledIcon
                  name="pencil"
                  width={16}
                  height={16}
                  color="gray"
                  onClick={handleClickEdit}
                />
                <StyledIcon
                  name="trash"
                  width={16}
                  height={16}
                  color="gray"
                  onClick={handleDeleteNote}
                />
              </IconsWrapper>
            </>
          )}
        </>
      ) : (
        handleClickAcceptEdit && (
          <AddBtn color="transparent" icon="plus" onClick={handleClickAdd}>
            Add note
          </AddBtn>
        )
      )}
    </Wrapper>
  );
};
