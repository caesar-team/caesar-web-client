import React, { memo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import {
  DASHBOARD_MODE,
  LIST_TYPE,
  PERMISSION,
  PERMISSION_ENTITY,
  TEAM_TYPE,
} from '@caesar/common/constants';
import { currentTeamSelector } from '@caesar/common/selectors/currentUser';
import {
  teamListsSelector,
  favoritesListSelector,
} from '@caesar/common/selectors/entities/list';
import { itemsByListIdSelector } from '@caesar/common/selectors/entities/item';
import {
  workInProgressListSelector,
  isVaultLoadingSelector,
} from '@caesar/common/selectors/workflow';
import {
  setWorkInProgressItem,
  setWorkInProgressListId,
  resetWorkInProgressItemIds,
} from '@caesar/common/actions/workflow';
import { sortListRequest } from '@caesar/common/actions/entities/list';
import { teamListsSizesByIdSelector } from '@caesar/common/selectors/counts';
import { Can } from '../../Ability';
import { Icon } from '../../Icon';
import { Scrollbar } from '../../Scrollbar';
import { ListItem } from './ListItem';
import { DummyLists } from './DummyLists';
import { MenuItemInner } from './styledComponents';

const MenuItem = styled.div``;

const MenuItemTitle = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  padding-left: 16px;
  margin-right: auto;
`;

const MenuItemCounter = styled.span`
  margin-left: auto;
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
    background-color: ${({ withNested, isEdit, theme }) =>
      !withNested && !isEdit && theme.color.snow};
    border-top-color: ${({ withNested, isEdit, theme }) =>
      !withNested && !isEdit && theme.color.gallery};
    border-bottom-color: ${({ withNested, isEdit, theme }) =>
      !withNested && !isEdit && theme.color.gallery};

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
}) => {
  const dispatch = useDispatch();
  const currentTeam = useSelector(currentTeamSelector);
  const workInProgressList = useSelector(workInProgressListSelector);
  const currentTeamId = currentTeam?.id;
  const activeListId = workInProgressList?.id;
  const [isCreatingMode, setCreatingMode] = useState(false);
  const isVaultLoading = useSelector(isVaultLoadingSelector);
  const teamLists = useSelector(state =>
    teamListsSelector(state, { teamId: currentTeamId }),
  );
  const inboxList = teamLists.find(list => list.type === LIST_TYPE.INBOX);
  const favoritesList = useSelector(favoritesListSelector);
  const favoritesListItems = useSelector(state =>
    itemsByListIdSelector(state, {
      teamId: currentTeamId,
      listId: LIST_TYPE.FAVORITES,
    }),
  );
  const nestedLists = teamLists
    .filter(list => [LIST_TYPE.LIST, LIST_TYPE.DEFAULT].includes(list.type))
    .sort((a, b) => a.sort - b.sort);
  const trashList = teamLists.find(list => list.type === LIST_TYPE.TRASH);

  const listSizes = useSelector(state =>
    teamListsSizesByIdSelector(state, { teamId: currentTeamId }),
  );
  const getListCount = id => listSizes[id] || 0;

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
      id: inboxList?.id || null,
      title: 'Shared with me',
      length: getListCount(inboxList?.id),
      icon: 'share',
    },
    {
      id: favoritesList?.id,
      title: 'Favorites',
      length: favoritesListItems.length,
      icon: 'favorite',
    },
    {
      id: 'lists',
      title: 'Lists',
      icon: 'list',
      nested: nestedLists,
    },
    {
      id: trashList?.id,
      title: 'Trash',
      length: getListCount(trashList?.id),
      icon: 'trash',
    },
    {
      id: SECURE_MESSAGE_MODE,
      title: 'Secure Message',
      icon: 'lock-filled',
    },
  ];

  const nestedListsLabels = nestedLists?.map(({ label } = { label: null }) =>
    label?.toLowerCase(),
  );
  const { _permissions } = currentTeam || {};
  const listPermission = {
    ..._permissions,
    __typename:
      (currentTeamId || TEAM_TYPE.PERSONAL) === TEAM_TYPE.PERSONAL
        ? PERMISSION_ENTITY.LIST
        : PERMISSION_ENTITY.TEAM_LIST,
  };

  if (isVaultLoading) {
    return <DummyLists />;
  }
  return (
    <Scrollbar>
      {menuList.map(({ id, icon, title, length, nested }) => {
        const withNested = !!nested;
        
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
                withNested={withNested}
                onClick={() => {
                  if (id === SECURE_MESSAGE_MODE) {
                    return handleClickSecureMessage();
                  }

                  return withNested
                    ? setListsOpened(!isListsOpened)
                    : handleClickMenuItem(id);
                }}
              >
                <Icon name={icon} width={16} height={16} />
                <MenuItemTitle>
                  {title}
                  {typeof length === 'number' && (
                    <MenuItemCounter>{length}</MenuItemCounter>
                  )}
                </MenuItemTitle>
                {withNested && (
                  <>
                    <Can I={PERMISSION.CREATE} a={listPermission}>
                      <ListAddIcon
                        name="plus"
                        width={16}
                        height={16}
                        onClick={handleClickAddList}
                      />
                    </Can>
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
                      nestedListsLabels={nestedListsLabels}
                    />
                  )}
                  {nested?.length > 0 &&
                    (nested.length <= 1 ? (
                      nested.map((list = {}, index) => (
                        <ListItem
                          key={list.id}
                          list={list}
                          itemCount={getListCount(list.id)}
                          activeListId={activeListId}
                          index={index}
                          nestedListsLabels={nestedListsLabels}
                          onClickMenuItem={handleClickMenuItem}
                        />
                      ))
                    ) : (
                      <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable
                          droppableId="droppable"
                          type="lists"
                          key={nested.length}
                        >
                          {provided => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              {nested.map((list, index) => (
                                <ListItem
                                  key={list.id}
                                  list={list}
                                  itemCount={getListCount(list.id)}
                                  activeListId={activeListId}
                                  index={index}
                                  isDraggable
                                  nestedListsLabels={nestedListsLabels}
                                  onClickMenuItem={handleClickMenuItem}
                                />
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    ))}
                </>
              )}
            </MenuItem>
          )
        );
      })}
    </Scrollbar>
  );
};

export const MenuListInner = memo(MenuListInnerComponent);
