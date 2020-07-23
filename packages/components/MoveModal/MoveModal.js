import React, { useState, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { userDataSelector } from '@caesar/common/selectors/user';
import { teamsByIdSelector } from '@caesar/common/selectors/entities/team';
import {
  moveItemRequest,
  moveItemsBatchRequest,
} from '@caesar/common/actions/entities/item';
import {
  setWorkInProgressItem,
  resetWorkInProgressItemIds,
} from '@caesar/common/actions/workflow';
import { useItemTeamAndListOptions } from '@caesar/common/hooks';
import { Modal, ModalTitle } from '../Modal';
import { Radio } from '../Radio';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Avatar } from '../Avatar';
import { SelectVisible } from '../SelectVisible';
import { withNotification } from '../Notification';
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
  notification,
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
  const user = useSelector(userDataSelector);
  const teamId = isMultiMode ? currentTeamId : item.teamId;
  const listId = isMultiMode ? currentListId : item.listId;

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
  } = useItemTeamAndListOptions({
    teamId,
    listId,
  });

  const handleClickAccept = () => {
    if (isMultiMode) {
      dispatch(
        moveItemsBatchRequest(
          workInProgressItemIds,
          checkedTeamId,
          checkedListId,
        ),
      );
      dispatch(resetWorkInProgressItemIds());

      notification.show({
        text: 'The items have been moved.',
      });
    } else {
      dispatch(moveItemRequest(item.id, checkedTeamId, checkedListId));
      dispatch(setWorkInProgressItem(null));

      notification.show({
        text: `The '${item.data.name}' has been moved.`,
      });
    }

    closeModal();
  };

  const handleCloseItem = itemId => () => {
    onRemove(itemId);
  };

  const teamAvatar = checkedTeamId && teamsById[checkedTeamId]?.icon;

  const teamOptionsRenderer = teamOptions
    .filter(team =>
      team?.title?.toLowerCase().includes(searchTeamValue?.toLowerCase()),
    )
    .map(team => (
      <StyledRadio
        key={team.id || team.title}
        value={team.id || team.title}
        label={
          <>
            <StyledTeamAvatar
              avatar={team.icon}
              email={team.email}
              size={24}
              fontSize="xs"
            />
            <Name>{team.title}</Name>
          </>
        }
        name="team"
        onChange={() => setCheckedTeamId(team.id)}
      />
    ));
  const listOptionsRenderer = listOptions
    .filter(list =>
      list?.label?.toLowerCase().includes(searchListValue?.toLowerCase()),
    )
    .map(list => (
      <StyledRadio
        key={list.id}
        value={list.id}
        label={<Name>{list.label}</Name>}
        name="list"
        onChange={() => setCheckedListId(list.id)}
      />
    ));

  return (
    <Modal
      isOpened={isOpened}
      width={640}
      onRequestClose={closeModal}
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
    >
      <StyledModalTitle>
        {isMultiMode
          ? 'Move selected items to another vault or list'
          : 'Move item to another vault or list'
        }
      </StyledModalTitle>
      <ListsWrapper>
        <StyledSelectVisible
          label="Vault"
          active={
            <>
              {checkedTeamId ? (
                <StyledTeamAvatar size={24} fontSize="xs" avatar={teamAvatar} />
              ) : (
                <StyledTeamAvatar size={24} fontSize="xs" {...user} />
              )}
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
                  onClickClose={handleCloseItem(listItem.id)}
                  hasHover={false}
                  isInModal
                  {...listItem}
                />
              ))}
            </Scrollbar>
          </ListItemsWrapper>
        </Items>
      )}
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

const MoveModal = memo(withNotification(MoveModalComponent));

export default MoveModal;
