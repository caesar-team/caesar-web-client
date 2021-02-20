/* eslint-disable camelcase */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import { transformListTitle } from '@caesar/common/utils/string';
import { LIST_TYPE, PERMISSION } from '@caesar/common/constants';
import { ERROR } from '@caesar/common/validation/constants';
import { currentTeamSelector } from '@caesar/common/selectors/currentUser';
import {
  createListRequest,
  editListRequest,
} from '@caesar/common/actions/entities/list';
import { Can } from '../../Ability';
import { ListInput } from './ListInput';
import { ConfirmRemoveListModal } from './ConfirmRemoveListModal';
import {
  Title,
  Counter,
  ActionIcon,
  DnDIcon,
  Wrapper,
  StyledTooltip,
} from './styles';

export const ListItem = ({
  list = {},
  itemCount,
  nestedListsLabels = [],
  activeListId,
  index,
  isDarkMode,
  onClickMenuItem = Function.prototype,
  isCreatingMode,
  isDraggable,
  setCreatingMode,
}) => {
  const dispatch = useDispatch();
  const currentTeam = useSelector(currentTeamSelector);
  const { id, label, type, _permissions } = list;

  const isDefault = type === LIST_TYPE.DEFAULT;
  const [isEditMode, setEditMode] = useState(isCreatingMode);
  const [isOpenedPopup, setOpenedPopup] = useState(false);
  const [value, setValue] = useState(label);

  const listTitle = transformListTitle(label);
  const isListAlreadyExists =
    value !== label && nestedListsLabels.includes(value?.toLowerCase());

  const isAcceptDisabled = !value || value === label || isListAlreadyExists;

  const handleClickEdit = () => {
    setEditMode(true);
  };

  const handleClickRemove = () => {
    setOpenedPopup(true);
  };

  const handleClickAcceptEdit = () => {
    if (isAcceptDisabled) {
      return;
    }

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
          {dragHandleProps && (
            <div {...dragHandleProps}>
              <Can I={PERMISSION.SORT} a={_permissions}>
                <DnDIcon
                  name="drag-n-drop"
                  width={16}
                  height={16}
                  color="gray"
                />
              </Can>
            </div>
          )}
          <Title>{listTitle}</Title>
          <Can I={PERMISSION.EDIT} a={_permissions}>
            <Counter>{itemCount}</Counter>
          </Can>
          <Can not I={PERMISSION.EDIT} a={_permissions}>
            <div>{itemCount}</div>
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
      isDarkMode={isDarkMode}
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
            isDarkMode={isDarkMode}
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
