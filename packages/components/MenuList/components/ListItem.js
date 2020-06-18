import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { upperFirst } from '@caesar/common/utils/string';
import { LIST_TYPES_ARRAY } from '@caesar/common/constants';
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
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Counter = styled.div``;

const StyledIcon = styled(Icon)`
  flex: 0 0 16px;
  margin-left: 16px;
  transition: color 0.2s, opacity 0.2s;
  cursor: pointer;

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
  cursor: grab;
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
      display: ${({ isEdit }) => (isEdit ? 'none' : 'block')};
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
    setValue(label);
  };

  const itemTitle = LIST_TYPES_ARRAY.includes(label)
    ? upperFirst(label)
    : label;

  const renderInner = () => (
    <>
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
          <DnDIcon name="drag-n-drop" width={16} height={16} color="gray" />
          <Title>{itemTitle}</Title>
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
    </>
  );

  return isCreatingMode ? (
    <Wrapper
      isActive={activeListId === id && !isEditMode}
      onClick={() => handleClickMenuItem(id)}
      isEdit={isEditMode}
      isDefault={isDefault}
    >
      {renderInner()}
    </Wrapper>
  ) : (
    <>
      <Draggable
        key={id}
        draggableId={id}
        index={index}
        isDragDisabled={isEditMode}
      >
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
            {renderInner()}
          </Wrapper>
        )}
      </Draggable>
      <ConfirmRemoveListModal
        item={item}
        isOpenedPopup={isOpenedPopup}
        setIsOpenedPopup={setIsOpenedPopup}
      />
    </>
  );
};
