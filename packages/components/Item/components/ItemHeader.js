/* eslint-disable camelcase */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  TEAM_TYPE,
  TEAM_TEXT_TYPE,
  PERMISSION,
  PERMISSION_ENTITY,
} from '@caesar/common/constants';
import { transformListTitle } from '@caesar/common/utils/string';
import {
  listsByIdSelector,
  trashListSelector,
  teamsTrashListsSelector,
} from '@caesar/common/selectors/entities/list';
import { teamsByIdSelector } from '@caesar/common/selectors/entities/team';
import { setWorkInProgressItem } from '@caesar/common/actions/workflow';
import { toggleItemToFavoriteRequest } from '@caesar/common/actions/entities/item';
import { Button } from '../../Button';
import { Can } from '../../Ability';

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

const PathWrapper = styled.div`
  margin-right: auto;
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

  const teamTitle = item.teamId
    ? teamsById[item.teamId]?.title
    : TEAM_TEXT_TYPE[TEAM_TYPE.PERSONAL];

  const listTitle = transformListTitle(listsById[item.listId]?.label);

  const isTrashItem =
    item &&
    (item.listId === trashList?.id ||
      teamsTrashLists.map(({ id: listId }) => listId).includes(item.listId));

  const handleToggleFavorites = () => {
    dispatch(toggleItemToFavoriteRequest(item));
  };

  const handleClickCloseItem = () => {
    dispatch(setWorkInProgressItem(null));
  };

  const itemSubject = item.teamId
    ? {
        __typename: PERMISSION_ENTITY.TEAM_ITEM,
        team_move_item: !!item._links?.team_move_item,
        team_batch_share_item: !!item._links?.team_batch_share_item,
        team_favorite_item_toggle: !!item._links?.team_favorite_item_toggle,
        team_delete_item: !!item._links?.team_delete_item,
      }
    : {
        __typename: PERMISSION_ENTITY.ITEM,
        move_item: !!item._links?.move_item,
        batch_share_item: !!item._links?.batch_share_item,
        favorite_item_toggle: !!item._links?.favorite_item_toggle,
        delete_item: !!item._links?.delete_item,
      };

  return (
    <ColumnHeader>
      {isTrashItem ? (
        <>
          <Empty />
          <Can I={PERMISSION.RESTORE} an={itemSubject}>
            <ActionButton color="white" onClick={onClickRestoreItem}>
              Restore
            </ActionButton>
          </Can>
          <Can I={PERMISSION.DELETE} an={itemSubject}>
            <ActionButton
              icon="trash"
              color="white"
              onClick={onClickRemoveItem}
            />
          </Can>
        </>
      ) : (
        <>
          <Can I={PERMISSION.MOVE} an={itemSubject}>
            <PathButton color="white" onClick={onClickMove}>
              <PathText>{teamTitle}</PathText>
              <Delimeter>|</Delimeter>
              <PathText>{listTitle}</PathText>
            </PathButton>
          </Can>
          <Can not I={PERMISSION.MOVE} an={itemSubject}>
            <PathWrapper>
              <PathText>{teamTitle}</PathText>
              <Delimeter>|</Delimeter>
              <PathText>{listTitle}</PathText>
            </PathWrapper>
          </Can>
          <Can I={PERMISSION.SHARE} an={itemSubject}>
            <ActionButton icon="share" color="white" onClick={onClickShare} />
          </Can>
          <Can I={PERMISSION.FAVORITE} an={itemSubject}>
            <ActionButton
              icon={item.favorite ? 'favorite-active' : 'favorite'}
              color="white"
              onClick={handleToggleFavorites}
            />
          </Can>
        </>
      )}
      <ActionButton icon="close" color="white" onClick={handleClickCloseItem} />
    </ColumnHeader>
  );
};
