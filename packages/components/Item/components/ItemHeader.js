/* eslint-disable camelcase */
import React, { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  TEAM_TYPE,
  TEAM_TEXT_TYPE,
  PERMISSION,
} from '@caesar/common/constants';
import { transformListTitle } from '@caesar/common/utils/string';
import { getTeamTitle } from '@caesar/common/utils/team';
import {
  listsByIdSelector,
  currentTeamTrashListSelector,
} from '@caesar/common/selectors/entities/list';
import { teamsByIdSelector } from '@caesar/common/selectors/entities/team';
import { setWorkInProgressItem } from '@caesar/common/actions/workflow';
import { toggleItemToFavoriteRequest } from '@caesar/common/actions/entities/item';
import { Hint, HINT_POSITION } from '../../Hint';
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
  font-size: ${({ theme }) => theme.font.size.main};
  text-transform: initial;

  ${Button.Text} {
    display: flex;
  }
`;

const PathWrapper = styled.div`
  display: flex;
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

const StyledHintPath = styled(Hint)`
  margin-right: auto;
`;

const StyledHint = styled(Hint)`
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
  const trashList = useSelector(currentTeamTrashListSelector);
  const teamsById = useSelector(teamsByIdSelector);
  const listsById = useSelector(listsByIdSelector);

  const teamTitle = item.teamId
    ? getTeamTitle(teamsById[item.teamId])
    : TEAM_TEXT_TYPE[TEAM_TYPE.PERSONAL];

  const listTitle = transformListTitle(listsById[item.listId]?.label);

  const isTrashItem = item && item.listId === trashList?.id;

  const handleToggleFavorites = () => {
    dispatch(toggleItemToFavoriteRequest(item));
  };

  const handleClickCloseItem = () => {
    dispatch(setWorkInProgressItem(null));
  };

  // TODO: Refactor the duplicated code
  const { _permissions } = item || {};

  return (
    <ColumnHeader>
      {isTrashItem ? (
        <>
          <Empty />
          <Can I={PERMISSION.RESTORE} an={_permissions}>
            <ActionButton color="white" onClick={onClickRestoreItem}>
              Restore
            </ActionButton>
          </Can>
          <Can I={PERMISSION.DELETE} an={_permissions}>
            <Hint text="Remove the item">
              <ActionButton
                icon="trash"
                color="white"
                onClick={onClickRemoveItem}
              />
            </Hint>
          </Can>
        </>
      ) : (
        <>
          <Can I={PERMISSION.MOVE} an={_permissions}>
            <StyledHintPath text="Move the item">
              <PathButton color="white" onClick={onClickMove}>
                <PathText>{teamTitle}</PathText>
                <Delimeter>|</Delimeter>
                <PathText>{listTitle}</PathText>
              </PathButton>
            </StyledHintPath>
          </Can>
          <Can not I={PERMISSION.MOVE} an={_permissions}>
            <PathWrapper>
              <PathText>{teamTitle}</PathText>
              <Delimeter>|</Delimeter>
              <PathText>{listTitle}</PathText>
            </PathWrapper>
          </Can>
          <Can I={PERMISSION.SHARE} an={_permissions}>
            <StyledHint text="Share the item">
              <Button icon="share" color="white" onClick={onClickShare} />
            </StyledHint>
          </Can>
          <Can I={PERMISSION.FAVORITE} an={_permissions}>
            <StyledHint text="Favorite">
              <Button
                icon={item.favorite ? 'favorite-active' : 'favorite'}
                color="white"
                onClick={handleToggleFavorites}
              />
            </StyledHint>
          </Can>
        </>
      )}
      <StyledHint text="Close the item" position={HINT_POSITION.TOP_LEFT}>
        <Button icon="close" color="white" onClick={handleClickCloseItem} />
      </StyledHint>
    </ColumnHeader>
  );
};

export const ItemHeader = memo(ItemHeaderComponent);
