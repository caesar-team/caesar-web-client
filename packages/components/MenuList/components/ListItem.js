import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import {
  createListRequest,
  editListRequest,
} from '@caesar/common/actions/entities/list';
import { Icon } from '../../Icon';
import { ListItemInput } from './ListItemInput';
import { ConfirmRemoveListModal } from './ConfirmRemoveListModal';
import { MenuItemInner } from './styledComponents';

const Title = styled.div`
  margin-right: auto;
`;

const Counter = styled.div``;

const StyledIcon = styled(Icon)`
  margin-left: 16px;
  transition: color 0.2s, opacity 0.2s;
  cursor: pointer;

  ${({ isDisabled }) =>
    isDisabled &&
    isDisabled !== undefined &&
    `
      pointer-events: none;
      opacity: 0.2;
    `}

  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
`;

const ItemIcon = styled(StyledIcon)`
  display: none;
`;

const DnDIcon = styled(ItemIcon)`
  position: absolute;
  top: 50%;
  left: 24px;
  margin-left: 0;
  transform: translateY(-50%);
`;

const Wrapper = styled(MenuItemInner)`
  position: relative;
  padding: ${({ isEdit }) => (isEdit ? '0 24px 0 40px' : '7px 24px 7px 56px')};
  color: ${({ isActive, theme }) =>
    isActive ? theme.color.black : theme.color.gray};

  &:hover {
    color: ${({ theme }) => theme.color.black};

    ${Counter} {
      ${({ isDefault }) => !isDefault && `display: none;`}
    }
    ${ItemIcon} {
      display: block;
    }
    ${DnDIcon} {
      display: block;
    }
  }
`;

export const ListItem = ({
  item = {},
  activeListId,
  index,
  handleClickMenuItem = Function.prototype,
  isCreatingMode,
  setIsCreatingMode,
}) => {
  const dispatch = useDispatch();
  const { id, label, children = [] } = item;
  const isDefault = label === 'default';
  const [isEditMode, setIsEditMode] = useState(isCreatingMode);
  const [isOpenedPopup, setIsOpenedPopup] = useState(false);
  const [value, setValue] = useState(label);

  const handleClickEdit = () => {
    setIsEditMode(true);
  };

  const handleClickRemove = () => {
    setIsOpenedPopup(true);
  };

  const handleClickAcceptEdit = () => {
    if (isCreatingMode) {
      dispatch(createListRequest({ label: value }));
      setIsCreatingMode(false);
    } else {
      dispatch(editListRequest({ ...item, label: value }));
    }

    setIsEditMode(false);
  };

  const handleClickClose = () => {
    if (isCreatingMode) {
      setIsCreatingMode(false);
    }

    setIsEditMode(false);
  };

  return (
    <>
      <Draggable key={id} draggableId={id} index={index}>
        {provided => (
          <Wrapper
            isActive={activeListId === id && !isEditMode}
            onClick={() => handleClickMenuItem(id)}
            isEdit={isEditMode}
            isDefault={isDefault}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            {isEditMode ? (
              <ListItemInput
                isEditMode={isEditMode}
                setIsEditMode={setIsEditMode}
                isCreatingMode={isCreatingMode}
                setIsCreatingMode={setIsCreatingMode}
                value={value}
                setValue={setValue}
                label={label}
                handleClickAcceptEdit={handleClickAcceptEdit}
                handleClickClose={handleClickClose}
              />
            ) : (
              <>
                <DnDIcon
                  name="drag-n-drop"
                  width={16}
                  height={16}
                  color="gray"
                />
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
            <DnDIcon name="drag-n-drop" width={16} height={16} color="gray" />
          </Wrapper>
        )}
      </Draggable>
      <ConfirmRemoveListModal
        id={id}
        isOpenedPopup={isOpenedPopup}
        setIsOpenedPopup={setIsOpenedPopup}
      />
    </>
  );
};
