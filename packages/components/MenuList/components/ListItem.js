/* eslint-disable camelcase */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { transformListTitle } from '@caesar/common/utils/string';
import { LIST_TYPE, PERMISSION } from '@caesar/common/constants';
import { ERROR } from '@caesar/common/validation/constants';
import { currentTeamSelector } from '@caesar/common/selectors/user';
import {
  createListRequest,
  editListRequest,
} from '@caesar/common/actions/entities/list';
import { generalItemsSelector } from '@caesar/common/selectors/entities/item';
import { Tooltip } from '@caesar/components/List/Item/styles';
import { Can } from '../../Ability';
import { Icon } from '../../Icon';
import { ListInput } from './ListInput';
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

const ActionIcon = styled(StyledIcon)`
  display: none;
`;

const DnDIcon = styled(ActionIcon)`
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
    ${ActionIcon} {
      display: block;
    }
    ${DnDIcon} {
      display: ${({ isEdit }) => (isEdit ? 'none' : 'block')};
    }
  }
`;

const StyledTooltip = styled(Tooltip)`
  display: flex;
  top: -20px;
  left: auto;
`;

export const ListItem = ({
  list = {},
  nestedListsLabels = [],
  activeListId,
  index,
  onClickMenuItem = Function.prototype,
  isCreatingMode,
  isDraggable,
  setCreatingMode,
}) => {
  const dispatch = useDispatch();
  const currentTeam = useSelector(currentTeamSelector);
  const { id, label, type, children = [] } = list;

  const generalItems = useSelector(state =>
    generalItemsSelector(state, { itemIds: children }),
  );

  const isDefault = type === LIST_TYPE.DEFAULT;
  const [isEditMode, setEditMode] = useState(isCreatingMode);
  const [isOpenedPopup, setOpenedPopup] = useState(false);
  const [value, setValue] = useState(label);

  const handleClickEdit = () => {
    setEditMode(true);
  };

  const handleClickRemove = () => {
    setOpenedPopup(true);
  };

  const handleClickAcceptEdit = () => {
    if (isCreatingMode) {
      dispatch(
        createListRequest(
          { label: value, teamId: currentTeam?.id || null },
          { setCreatingMode },
        ),
      );
    } else {
      dispatch(
        editListRequest(
          { ...list, label: value, teamId: currentTeam?.id || null },
          { setEditMode },
        ),
      );
    }
  };

  const handleClickClose = () => {
    if (isCreatingMode) {
      setCreatingMode(false);
    }

    setEditMode(false);
    setValue(label);
  };

  const listTitle = transformListTitle(label);
  const isListAlreadyExists =
    value !== label && nestedListsLabels.includes(value?.toLowerCase());

  const isAcceptDisabled = !value || value === label || isListAlreadyExists;

  const { _permissions } = list || {};

  const renderInner = dragHandleProps => (
    <>
      {isEditMode ? (
        <>
          <ListInput
            isEditMode={isEditMode}
            setEditMode={setEditMode}
            isCreatingMode={isCreatingMode}
            setCreatingMode={setCreatingMode}
            isAcceptDisabled={isAcceptDisabled}
            value={value}
            setValue={setValue}
            onClickAcceptEdit={handleClickAcceptEdit}
            onClickClose={handleClickClose}
          />
          {isListAlreadyExists && (
            <StyledTooltip>{ERROR.LIST_ALREADY_EXISTS}</StyledTooltip>
          )}
        </>
      ) : (
        <>
          <div {...dragHandleProps}>
            <Can I={PERMISSION.SORT} a={_permissions}>
              <DnDIcon name="drag-n-drop" width={16} height={16} color="gray" />
            </Can>
          </div>
          <Title>{listTitle}</Title>
          <Can I={PERMISSION.EDIT} a={_permissions}>
            <Counter>{generalItems.length}</Counter>
          </Can>
          <Can not I={PERMISSION.EDIT} a={_permissions}>
            <div>{generalItems.length}</div>
          </Can>
          <Can I={PERMISSION.EDIT} a={_permissions}>
            <ActionIcon
              name="pencil"
              width={16}
              height={16}
              color="gray"
              onClick={handleClickEdit}
            />
          </Can>
          <Can I={PERMISSION.DELETE} a={_permissions}>
            <ActionIcon
              name="trash"
              width={16}
              height={16}
              color="gray"
              onClick={handleClickRemove}
            />
          </Can>
        </>
      )}
    </>
  );

  return isCreatingMode || !isDraggable ? (
    <Wrapper
      isActive={activeListId === id && !isEditMode}
      onClick={() => onClickMenuItem(id)}
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
            onClick={() => onClickMenuItem(id)}
            isEdit={isEditMode}
            isDefault={isDefault}
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            {renderInner(provided.dragHandleProps)}
          </Wrapper>
        )}
      </Draggable>
      <ConfirmRemoveListModal
        currentTeam={currentTeam}
        list={list}
        isOpenedPopup={isOpenedPopup}
        setOpenedPopup={setOpenedPopup}
      />
    </>
  );
};
