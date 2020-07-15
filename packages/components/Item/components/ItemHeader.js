import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  TEAM_TYPE,
  TEAM_TEXT_TYPE,
  LIST_TYPES_ARRAY,
} from '@caesar/common/constants';
import { upperFirst } from '@caesar/common/utils/string';
import {
  listsByIdSelector,
  trashListSelector,
  teamsTrashListsSelector,
} from '@caesar/common/selectors/entities/list';
import { teamsByIdSelector } from '@caesar/common/selectors/entities/team';
import { setWorkInProgressItem } from '@caesar/common/actions/workflow';
import { toggleItemToFavoriteRequest } from '@caesar/common/actions/entities/item';
import { Button } from '../../Button';

const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  padding: 8px 24px;
  background-color: ${({ theme }) => theme.color.alto};
  border-bottom: 1px solid ${({ theme }) => theme.color.gallery};
`;

const Empty = styled.div`
  margin-right: auto;
`;

const PathButton = styled(Button)`
  margin-right: auto;
  font-size: ${({ theme }) => theme.font.size.main};
  text-transform: initial;

  ${Button.Text} {
    display: flex;
  }
`;

const PathText = styled.span`
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Delimeter = styled.span`
  margin: 0 16px;
`;

const ActionButton = styled(Button)`
  margin-left: 16px;
`;

export const ItemHeader = ({
  item,
  onClickShare,
  onClickMove,
  onClickRestoreItem,
  onClickRemoveItem,
}) => {
  const dispatch = useDispatch();
  const trashList = useSelector(trashListSelector);
  const teamsTrashLists = useSelector(teamsTrashListsSelector);
  const teamsById = useSelector(teamsByIdSelector);
  const listsById = useSelector(listsByIdSelector);
  const { id, favorite } = item;

  const teamTitle = item.teamId
    ? teamsById[item.teamId]?.title
    : TEAM_TEXT_TYPE[TEAM_TYPE.PERSONAL];

  const listTitle = LIST_TYPES_ARRAY.includes(listsById[item.listId]?.label)
    ? upperFirst(listsById[item.listId]?.label)
    : listsById[item.listId]?.label;

  const isTrashItem =
    item &&
    (item.listId === trashList.id ||
      teamsTrashLists.map(({ id: listId }) => listId).includes(item.listId));

  const handleToggleFavorites = () => {
    dispatch(toggleItemToFavoriteRequest(id));
  };

  const handleClickCloseItem = () => {
    dispatch(setWorkInProgressItem(null));
  };

  return (
    <ColumnHeader>
      {isTrashItem ? (
        <>
          <Empty />
          <ActionButton color="white" onClick={onClickRestoreItem}>
            Restore
          </ActionButton>
          <ActionButton
            icon="trash"
            color="white"
            onClick={onClickRemoveItem}
          />
        </>
      ) : (
        <>
          <PathButton color="white" onClick={onClickMove}>
            <PathText>{teamTitle}</PathText>
            <Delimeter>|</Delimeter>
            <PathText>{listTitle}</PathText>
          </PathButton>
          <ActionButton icon="share" color="white" onClick={onClickShare} />
          <ActionButton
            icon={favorite ? 'favorite-active' : 'favorite'}
            color="white"
            onClick={handleToggleFavorites}
          />
        </>
      )}
      <ActionButton icon="close" color="white" onClick={handleClickCloseItem} />
    </ColumnHeader>
  );
};
