import React, { useState, useRef } from 'react';
import { useClickAway } from 'react-use';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { editListRequest } from '@caesar/common/actions/entities/list';
import { Icon } from '../../Icon';
import { Input } from '../../Input';
import { ConfirmRemoveListModal } from './ConfirmRemoveListModal';
import { MenuItemInner } from './styledComponents';

const Title = styled.div`
  margin-right: auto;
`;

const Counter = styled.div``;

const StyledInput = styled(Input)`
  ${Input.InputField} {
    padding-right: 80px;
  }
`;

const StyledIcon = styled(Icon)`
  margin-left: 16px;
  transition: color 0.2s;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
`;

const ItemIcon = styled(StyledIcon)`
  display: none;
`;

const Wrapper = styled(MenuItemInner)`
  padding: ${({ isEdit }) => (isEdit ? '0 24px 0 40px' : '7px 24px 7px 56px')};
  color: ${({ isActive, theme }) =>
    isActive ? theme.color.black : theme.color.gray};

  &:hover {
    ${Counter} {
      ${({ isDefault }) => !isDefault && `display: none;`}
    }
    ${ItemIcon} {
      display: block;
    }
  }
`;

export const ListItem = ({ item, activeListId, handleClickMenuItem }) => {
  const dispatch = useDispatch();
  const { id, label, children = [] } = item;
  const isDefault = label === 'default';
  const [isEditMode, setIsEditMode] = useState(false);
  const [isOpenedPopup, setIsOpenedPopup] = useState(false);
  const [value, setValue] = useState(label);

  const handleClickEdit = () => {
    setIsEditMode(true);
  };

  const handleClickRemove = () => {
    setIsOpenedPopup(true);
  };

  const handleClickAcceptEdit = () => {
    dispatch(editListRequest({ ...item, label: value }));
    setIsEditMode(false);
  };

  const handleClickClose = () => {
    setIsEditMode(false);
  };

  const inputRef = useRef(null);
  useClickAway(inputRef, () => {
    if (isEditMode) {
      setIsEditMode(false);
    }
  });

  return (
    <>
      <Wrapper
        ref={inputRef}
        isActive={activeListId === id && !isEditMode}
        onClick={() => handleClickMenuItem(id)}
        isEdit={isEditMode}
        isDefault={isDefault}
      >
        {isEditMode ? (
          <StyledInput
            autoFocus
            value={value}
            onChange={e => setValue(e.target.value)}
            postfix={
              <>
                <StyledIcon
                  name="checkmark"
                  width={16}
                  height={16}
                  color="gray"
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
        ) : (
          <>
            <Title>{label}</Title>
            <Counter>{children.length}</Counter>
            {!isDefault && (
              <>
                <ItemIcon
                  name="pencil"
                  width={16}
                  height={16}
                  color="gray"
                  onClick={handleClickEdit}
                />
                <ItemIcon
                  name="trash"
                  width={16}
                  height={16}
                  color="gray"
                  onClick={handleClickRemove}
                />
              </>
            )}
          </>
        )}
      </Wrapper>
      <ConfirmRemoveListModal
        id={id}
        isOpenedPopup={isOpenedPopup}
        setIsOpenedPopup={setIsOpenedPopup}
      />
    </>
  );
};
