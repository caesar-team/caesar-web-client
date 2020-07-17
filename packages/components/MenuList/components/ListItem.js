/* eslint-disable camelcase */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { upperFirst } from '@caesar/common/utils/string';
import {
  LIST_TYPES_ARRAY,
  PERMISSION,
  PERMISSION_ENTITY,
} from '@caesar/common/constants';
import {
  createListRequest,
  editListRequest,
} from '@caesar/common/actions/entities/list';
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

export const ListItem = ({
  list = {},
  activeListId,
  index,
  onClickMenuItem = Function.prototype,
  isCreatingMode,
  notification,
  setCreatingMode,
}) => {
  const dispatch = useDispatch();
  const { id, label, children = [], teamId } = list;
  const isDefault = label === 'default';
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
        createListRequest({ label: value }, { notification, setCreatingMode }),
      );
    } else {
      dispatch(
        editListRequest(
          { ...list, label: value },
          { notification, setEditMode },
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

  const listTitle = LIST_TYPES_ARRAY.includes(label)
    ? upperFirst(label)
    : label;

  const listSubject = teamId
    ? {
        __typename: PERMISSION_ENTITY.TEAM_LIST,
        team_edit_list: !!list?._links?.team_edit_list,
        team_sort_list: !!list?._links?.team_sort_list,
        team_delete_list: !!list?._links?.team_delete_list,
      }
    : {
        __typename: PERMISSION_ENTITY.LIST,
        edit_list: !!list?._links?.edit_list,
        sort_list: !!list?._links?.sort_list,
        delete_list: !!list?._links?.delete_list,
      };

  const renderInner = () => (
    <>
      {isEditMode ? (
        <ListInput
          isEditMode={isEditMode}
          setEditMode={setEditMode}
          isCreatingMode={isCreatingMode}
          setCreatingMode={setCreatingMode}
          value={value}
          setValue={setValue}
          label={label}
          onClickAcceptEdit={handleClickAcceptEdit}
          onClickClose={handleClickClose}
        />
      ) : (
        <>
          <Can I={PERMISSION.SORT} a={listSubject}>
            <DnDIcon name="drag-n-drop" width={16} height={16} color="gray" />
          </Can>
          <Title>{listTitle}</Title>
          <Counter>{children.length}</Counter>
          <Can I={PERMISSION.EDIT} a={listSubject}>
            <ActionIcon
              name="pencil"
              width={16}
              height={16}
              color="gray"
              onClick={handleClickEdit}
            />
          </Can>
          <Can I={PERMISSION.DELETE} a={listSubject}>
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
      <DnDIcon name="drag-n-drop" width={16} height={16} color="gray" />
    </>
  );

  return isCreatingMode ? (
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
            {...provided.dragHandleProps}
          >
            {renderInner()}
          </Wrapper>
        )}
      </Draggable>
      <ConfirmRemoveListModal
        list={list}
        isOpenedPopup={isOpenedPopup}
        setOpenedPopup={setOpenedPopup}
      />
    </>
  );
};
