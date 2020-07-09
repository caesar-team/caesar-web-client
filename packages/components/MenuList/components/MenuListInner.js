import React, { memo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { DASHBOARD_MODE } from '@caesar/common/constants';
import { currentTeamSelector } from '@caesar/common/selectors/user';
import {
  personalListsByTypeSelector,
  currentTeamListsSelector,
  serverErrorSelector,
} from '@caesar/common/selectors/entities/list';
import { workInProgressListSelector } from '@caesar/common/selectors/workflow';
import {
  setWorkInProgressItem,
  setWorkInProgressListId,
  resetWorkInProgressItemIds,
} from '@caesar/common/actions/workflow';
import { sortListRequest } from '@caesar/common/actions/entities/list';
import { withNotification } from '@caesar/components/Notification';
import { Icon } from '../../Icon';
import { ListItem } from './ListItem';
import { MenuItemInner } from './styledComponents';

const MenuItem = styled.div``;

const MenuItemTitle = styled.div`
  padding-left: 16px;
  margin-right: auto;
`;

const ListAddIcon = styled(Icon)`
  margin-right: 16px;
  transform: ${({ isListsOpened }) =>
    isListsOpened ? 'scaleY(-1)' : 'scaleY(1)'};
  transition: transform 0.2s;
  opacity: 0;
  transition: opacity 0.2s, color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
`;

const StyledMenuItemInner = styled(MenuItemInner)`
  &:hover {
    background-color: ${({ withChildren, isEdit, theme }) =>
      !withChildren && !isEdit && theme.color.snow};
    border-top-color: ${({ withChildren, isEdit, theme }) =>
      !withChildren && !isEdit && theme.color.gallery};
    border-bottom-color: ${({ withChildren, isEdit, theme }) =>
      !withChildren && !isEdit && theme.color.gallery};

    ${ListAddIcon} {
      opacity: 1;
    }
  }
`;

const ListToggleIcon = styled(Icon)`
  transform: ${({ isListsOpened }) =>
    isListsOpened ? 'scaleY(-1)' : 'scaleY(1)'};
  transition: transform 0.2s;
`;

const SECURE_MESSAGE_MODE = 'SECURE_MESSAGE_MODE';

const MenuListInnerComponent = ({
  mode,
  setSearchedText,
  setMode,
  isListsOpened,
  setListsOpened,
  notification,
}) => {
  const dispatch = useDispatch();
  const currentTeam = useSelector(currentTeamSelector);
  const isPersonal = !currentTeam;
  const personalLists = useSelector(personalListsByTypeSelector);
  const teamLists = useSelector(currentTeamListsSelector);
  const workInProgressList = useSelector(workInProgressListSelector);
  const activeListId = workInProgressList && workInProgressList.id;
  const [isCreatingMode, setCreatingMode] = useState(false);

  const handleClickMenuItem = id => {
    dispatch(setWorkInProgressListId(id));
    dispatch(setWorkInProgressItem(null));
    dispatch(resetWorkInProgressItemIds());

    setMode(DASHBOARD_MODE.DEFAULT);
    setSearchedText('');
  };

  const handleClickSecureMessage = () => {
    dispatch(setWorkInProgressListId(null));

    setMode(DASHBOARD_MODE.TOOL);
    setSearchedText('');
  };

  const handleClickAddList = event => {
    event.stopPropagation();
    setListsOpened(true);
    setCreatingMode(true);
  };

  const handleDragEnd = ({ draggableId, source, destination }) => {
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    dispatch(sortListRequest(draggableId, source.index, destination.index));
  };

  const menuList = [
    {
      id: isPersonal ? personalLists.inbox?.id : '',
      title: 'Inbox',
      icon: 'inbox',
    },
    {
      id: isPersonal ? personalLists.favorites?.id : teamLists.favorites?.id,
      title: 'Favorites',
      icon: 'favorite',
    },
    {
      id: 'lists',
      title: 'Lists',
      icon: 'list',
      children: isPersonal ? personalLists.list : teamLists.list,
    },
    // TODO: Implement History feature
    // {
    //   id: 'history',
    //   title: 'History',
    //   icon: 'history',
    // },
    {
      id: isPersonal ? personalLists.trash?.id : teamLists.trash?.id,
      title: 'Trash',
      icon: 'trash',
    },
    {
      id: SECURE_MESSAGE_MODE,
      title: 'Secure Message',
      icon: 'lock-filled',
    },
  ];

  return menuList.map(({ id, icon, title, children }) => {
    const withChildren = id === 'lists';

    return (
      id && (
        <MenuItem key={id}>
          <StyledMenuItemInner
            isActive={
              id === SECURE_MESSAGE_MODE
                ? mode === SECURE_MESSAGE_MODE
                : activeListId === id
            }
            fontWeight={id === SECURE_MESSAGE_MODE ? 600 : 400}
            withChildren={withChildren}
            onClick={() => {
              if (id === SECURE_MESSAGE_MODE) {
                return handleClickSecureMessage();
              }

              return withChildren
                ? setListsOpened(!isListsOpened)
                : handleClickMenuItem(id);
            }}
          >
            <Icon name={icon} width={16} height={16} />
            <MenuItemTitle>{title}</MenuItemTitle>
            {withChildren && (
              <>
                <ListAddIcon
                  name="plus"
                  width={16}
                  height={16}
                  onClick={handleClickAddList}
                />
                <ListToggleIcon
                  name="arrow-triangle"
                  width={16}
                  height={16}
                  isListsOpened={isListsOpened}
                />
              </>
            )}
          </StyledMenuItemInner>
          {isListsOpened && (
            <>
              {id === 'lists' && isCreatingMode && (
                <ListItem
                  isCreatingMode={isCreatingMode}
                  setCreatingMode={setCreatingMode}
                  notification={notification}
                />
              )}
              {children && (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable
                    droppableId="droppable"
                    type="lists"
                    key={children.length}
                  >
                    {provided => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        {children.map((item, index) => (
                          <ListItem
                            key={item.id}
                            item={item}
                            activeListId={activeListId}
                            index={index}
                            notification={notification}
                            handleClickMenuItem={handleClickMenuItem}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </>
          )}
        </MenuItem>
      )
    );
  });
};

export const MenuListInner = memo(withNotification(MenuListInnerComponent));
