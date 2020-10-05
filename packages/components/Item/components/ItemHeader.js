/* eslint-disable camelcase */
import React, { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  TEAM_TYPE,
  TEAM_TEXT_TYPE,
  PERMISSION,
  PERMISSION_ENTITY,
} from '@caesar/common/constants';
import { transformListTitle } from '@caesar/common/utils/string';
import { getTeamTitle } from '@caesar/common/utils/team';
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
  flex: 0 0 56px;
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

const ItemHeaderComponent = ({
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
    ? getTeamTitle(teamsById[item.teamId])
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

  // TODO: Refactor the duplicated code
  const itemSubject =
    item?.teamId === TEAM_TYPE.PERSONAL
      ? {
          __typename: PERMISSION_ENTITY.ITEM,
          move_item: item?._permissions?.move_item || false,
          batch_share_item: item?._permissions?.batch_share_item || false,
          favorite_item_toggle:
            item?._permissions?.favorite_item_toggle || false,
          delete_item: item?._permissions?.delete_item || false,
        }
      : {
          __typename: PERMISSION_ENTITY.TEAM_ITEM,
          team_move_item: item?._permissions?.team_move_item || false,
          team_batch_share_item:
            item?._permissions?.team_batch_share_item || false,
          team_favorite_item_toggle:
            item?._permissions?.team_favorite_item_toggle || false,
          team_delete_item: item?._permissions?.team_delete_item || false,
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

export const ItemHeader = memo(ItemHeaderComponent);
