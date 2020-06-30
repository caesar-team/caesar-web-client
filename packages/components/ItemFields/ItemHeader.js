import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  trashListSelector,
  teamsTrashListsSelector,
} from '@caesar/common/selectors/entities/list';
import { setWorkInProgressItem } from '@caesar/common/actions/workflow';
import { toggleItemToFavoriteRequest } from '@caesar/common/actions/entities/item';
import { Button } from '../Button';

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
  onClickRestoreItem,
  onClickRemoveItem,
}) => {
  const dispatch = useDispatch();
  const trashList = useSelector(trashListSelector);
  const teamsTrashLists = useSelector(teamsTrashListsSelector);
  const { id, favorite } = item;

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
          <PathButton
            color="white"
            onClick={() => {
              console.log('Change path');
            }}
          >
            Personal
            <Delimeter>|</Delimeter>
            Passwords
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
