import React, { useState, useMemo, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import equal from 'fast-deep-equal';
import styled from 'styled-components';
import { teamsByIdSelector } from '@caesar/common/selectors/entities/team';
import {
  moveItemRequest,
  moveItemsBatchRequest,
} from '@caesar/common/actions/entities/item';
import {
  setWorkInProgressItem,
  resetWorkInProgressItemIds,
} from '@caesar/common/actions/workflow';
import { getTeamTitle } from '@caesar/common/utils/team';
import {
  useItemVaultAndListOptions,
  useNotification,
} from '@caesar/common/hooks';
import { Modal, ModalTitle } from '../Modal';
import { Radio } from '../Radio';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Avatar } from '../Avatar';
import { SelectVisible } from '../SelectVisible';
import { ListItem } from '../List';
import { Scrollbar } from '../Scrollbar';
import { TextWithLines } from '../TextWithLines';

const ListsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledSelectVisible = styled(SelectVisible)`
  flex: 0 0 calc(50% - 20px);
  width: calc(50% - 20px);
`;

const StyledRadio = styled(Radio)`
  ${Radio.Label} {
    max-width: 100%;
    overflow: hidden;
  }
`;

const StyledTeamAvatar = styled(Avatar)`
  margin-right: 16px;
`;

const Name = styled.span`
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ListIcon = styled(Icon)`
  flex: 0 0 16px;
  margin-right: 16px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 16px;
`;

const ButtonStyled = styled(Button)`
  margin-right: 16px;
`;

const ListItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 0 20px;
`;

const ListItemStyled = styled(ListItem)`
  margin-bottom: 4px;
  border-bottom: none;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const TextWithLinesStyled = styled(TextWithLines)`
  &::after {
    margin-right: 0;
  }
`;

const Items = styled.div`
  margin-top: 16px;
`;

const StyledModalTitle = styled(ModalTitle)`
  justify-content: flex-start;
`;

const MoveModalComponent = ({
  item,
  items,
  currentTeamId,
  currentListId,
  workInProgressItemIds,
  isOpened,
  isMultiMode = false,
  closeModal,
  onRemove = Function.prototype,
}) => {
  const dispatch = useDispatch();
  const teamsById = useSelector(teamsByIdSelector);
  const teamId = isMultiMode ? currentTeamId : item.teamId;
  const listId = isMultiMode ? currentListId : item.listId;
  const notification = useNotification();

  const [searchTeamValue, setSearchTeamValue] = useState('');
  const [searchListValue, setSearchListValue] = useState('');

  const {
    checkedTeamId,
    checkedTeamTitle,
    checkedListId,
    checkedListLabel,
    setCheckedTeamId,
    setCheckedListId,
    teamOptions,
    listOptions,
  } = useItemVaultAndListOptions({
    teamId,
    listId,
  });

  const handleClickAccept = () => {
    if (isMultiMode) {
      dispatch(
        moveItemsBatchRequest({
          itemIds: workInProgressItemIds,
          oldTeamId: teamId,
          oldListId: listId,
          teamId: checkedTeamId,
          listId: checkedListId,
          notification,
        }),
      );
      dispatch(resetWorkInProgressItemIds());
    } else {
      dispatch(
        moveItemRequest({
          itemId: item.id,
          teamId: checkedTeamId,
          listId: checkedListId,
          notification,
        }),
      );
      dispatch(setWorkInProgressItem(null));
    }

    closeModal();
  };

  const handleDeleteItem = itemId => () => {
    onRemove(itemId);
  };

  const teamAvatar = teamsById[checkedTeamId]?.icon;
  const teamEmail = teamsById[checkedTeamId]?.email;

  const teamOptionsRenderer = useMemo(
    () =>
      teamOptions
        .filter(team =>
          team?.title?.toLowerCase().includes(searchTeamValue?.toLowerCase()),
        )
        .map(team => (
          <StyledRadio
            key={team.id}
            value={team.id}
            label={
              <>
                <StyledTeamAvatar
                  avatar={team.icon}
                  email={team.email}
                  size={24}
                  fontSize="xs"
                />
                <Name>{getTeamTitle(team)}</Name>
              </>
            }
            name="team"
            checked={team.id === checkedTeamId}
            onChange={() => setCheckedTeamId(team.id)}
          />
        )),
    [teamOptions, checkedTeamId],
  );

  const listOptionsRenderer = useMemo(
    () =>
      listOptions
        .filter(list =>
          list?.label?.toLowerCase().includes(searchListValue?.toLowerCase()),
        )
        .map(list => (
          <StyledRadio
            key={list.id}
            value={list.id}
            label={<Name>{list.label}</Name>}
            name="list"
            checked={list.id === checkedListId}
            onChange={() => setCheckedListId(list.id)}
          />
        )),
    [listOptions, checkedListId],
  );

  return (
    <Modal
      isOpened={isOpened}
      width={640}
      onRequestClose={closeModal}
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
    >
      <Scrollbar autoHeight autoHeightMax={500}>
        <StyledModalTitle>
          {isMultiMode
            ? 'Move selected items to another vault or list'
            : 'Move item to another vault or list'}
        </StyledModalTitle>
        <ListsWrapper>
          <StyledSelectVisible
            label="Vault"
            active={
              <>
                <StyledTeamAvatar
                  size={24}
                  fontSize="xs"
                  avatar={teamAvatar}
                  email={teamEmail}
                />
                <Name>{checkedTeamTitle}</Name>
              </>
            }
            options={teamOptionsRenderer}
            searchPlaceholder="Search vault…"
            searchValue={searchTeamValue}
            setSearchValue={setSearchTeamValue}
          />
          <StyledSelectVisible
            label="List"
            active={
              <>
                <ListIcon name="list" width={16} height={16} color="white" />
                <Name>{checkedListLabel}</Name>
              </>
            }
            options={listOptionsRenderer}
            searchPlaceholder="Search list…"
            searchValue={searchListValue}
            setSearchValue={setSearchListValue}
          />
        </ListsWrapper>
        {isMultiMode && (
          <Items>
            <TextWithLinesStyled position="left" width={1}>
              Selected items ({items.length})
            </TextWithLinesStyled>
            <ListItemsWrapper>
              <Scrollbar autoHeight autoHeightMax={400}>
                {items.map(listItem => (
                  <ListItemStyled
                    isClosable
                    key={listItem.id}
                    onClickClose={handleDeleteItem(listItem.id)}
                    hasHover={false}
                    isInModal
                    {...listItem}
                  />
                ))}
              </Scrollbar>
            </ListItemsWrapper>
          </Items>
        )}
      </Scrollbar>
      <ButtonsWrapper>
        <ButtonStyled color="white" onClick={closeModal}>
          Cancel
        </ButtonStyled>
        <Button
          onClick={handleClickAccept}
          disabled={
            checkedListId === listId ||
            !listOptions.map(({ id }) => id).includes(checkedListId)
          }
        >
          Accept
        </Button>
      </ButtonsWrapper>
    </Modal>
  );
};

const MoveModal = memo(MoveModalComponent, (prevProps, nextProps) =>
  equal(prevProps, nextProps),
);

export default MoveModal;
