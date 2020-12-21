import React, { useState } from 'react';
import { useUpdateEffect } from 'react-use';
import styled from 'styled-components';
import { PERMISSION } from '@caesar/common/constants';
import { makeObject } from '@caesar/common/utils/object';
import { Can } from '../../Ability';
import { Icon } from '../../Icon';
import { FormTextArea } from '../../Input';
import { Button } from '../../Button';
import { TextError } from '../../Error';

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
  display: none;
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

const Wrapper = styled.div`
  position: relative;

  &:hover {
    ${IconsWrapper} {
      display: flex;
    }
  }
`;

export const Note = ({
  value: propValue,
  schema,
  itemSubject,
  onClickAcceptEdit,
}) => {
  const [isEdit, setEdit] = useState(false);
  const [isFocused, setFocused] = useState(false);
  const [value, setValue] = useState(propValue);
  const [error, setError] = useState(null);

  useUpdateEffect(() => {
    if (propValue !== value) {
      setValue(propValue);
    }
  }, [propValue]);

  const handleClickAdd = () => {
    setEdit(true);
  };

  const handleClickEdit = () => {
    setEdit(true);
    setFocused(true);
  };

  const handleDeleteNote = () => {
    onClickAcceptEdit(makeObject('note', ''));
  };

  const handleChange = event => {
    const val = event.target.value;

    setValue(val);

    if (!schema) return;

    setError(null);

    try {
      schema.validateSync(val);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Wrapper>
      {propValue || isEdit ? (
        <>
          <Can I={PERMISSION.EDIT} an={itemSubject}>
            <StyledFormTextArea
              label="Notes"
              value={value}
              onChange={handleChange}
              onFocus={onClickAcceptEdit && (() => setEdit(true))}
              onClickAcceptEdit={() => {
                onClickAcceptEdit(makeObject('note', value));
                setEdit(false);
              }}
              onClickAway={() => setEdit(false)}
              onClickClose={() => setEdit(false)}
              isFocused={isFocused}
              isEdit={isEdit}
              isDisabled={!onClickAcceptEdit}
            />
          </Can>
          <Can not I={PERMISSION.EDIT} an={itemSubject}>
            <StyledFormTextArea label="Notes" value={value} />
          </Can>
          <Can I={PERMISSION.EDIT} an={itemSubject}>
            {!isEdit && onClickAcceptEdit && (
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
          </Can>
        </>
      ) : (
        <Can I={PERMISSION.EDIT} an={itemSubject}>
          {onClickAcceptEdit && (
            <AddBtn color="transparent" icon="plus" onClick={handleClickAdd}>
              Add note
            </AddBtn>
          )}
        </Can>
      )}
      {error && <TextError marginTop={4}>{error}</TextError>}
    </Wrapper>
  );
};
