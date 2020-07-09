import React, { useState, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  TEAM_TYPE,
  TEAM_TEXT_TYPE,
  LIST_TYPES_ARRAY,
} from '@caesar/common/constants';
import { upperFirst } from '@caesar/common/utils/string';
import { userDataSelector } from '@caesar/common/selectors/user';
import { teamsByIdSelector } from '@caesar/common/selectors/entities/team';
import { listsByIdSelector } from '@caesar/common/selectors/entities/list';
import { moveItemRequest } from '@caesar/common/actions/entities/item';
import { setWorkInProgressItem } from '@caesar/common/actions/workflow';
import { useItemTeamAndListOptions } from '@caesar/common/hooks';
import { Modal, ModalTitle } from '../../Modal';
import { Radio } from '../../Radio';
import { Button } from '../../Button';
import { Icon } from '../../Icon';
import { Avatar } from '../../Avatar';
import { SelectVisible } from '../../SelectVisible';
import { withNotification } from '../../Notification';

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

const MoveModalComponent = ({ notification, item, isOpened, closeModal }) => {
  const dispatch = useDispatch();
  const teamsById = useSelector(teamsByIdSelector);
  const listsById = useSelector(listsByIdSelector);
  const user = useSelector(userDataSelector);

  const teamAvatar = item.teamId && teamsById[item.teamId]?.icon;
  const teamTitle = item.teamId
    ? teamsById[item.teamId]?.title
    : TEAM_TEXT_TYPE[TEAM_TYPE.PERSONAL];
  const listTitle = LIST_TYPES_ARRAY.includes(listsById[item.listId]?.label)
    ? upperFirst(listsById[item.listId]?.label)
    : listsById[item.listId]?.label;

  const [searchTeamValue, setSearchTeamValue] = useState('');
  const [searchListValue, setSearchListValue] = useState('');

  const {
    checkedTeamId,
    checkedListId,
    setCheckedTeamId,
    setCheckedListId,
    teamOptions,
    listOptions,
  } = useItemTeamAndListOptions({
    teamId: item.teamId,
    listId: item.listId,
  });

  const handleClickAccept = () => {
    dispatch(moveItemRequest(item.id, checkedTeamId, checkedListId));
    dispatch(setWorkInProgressItem(null));

    notification.show({
      text: `The '${item.data.name}' has been moved.`,
    });

    closeModal();
  };

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
      width={720}
      onRequestClose={closeModal}
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
    >
      <ModalTitle>Move item to another team or list </ModalTitle>
      <ListsWrapper>
        <StyledSelectVisible
          label="Team"
          active={
            <>
              <StyledTeamAvatar
                size={24}
                fontSize="xs"
                avatar={teamAvatar}
                {...user}
              />
              <Name>{teamTitle}</Name>
            </>
          }
          options={teamOptionsRenderer}
          searchPlaceholder="Search by teams…"
          searchValue={searchTeamValue}
          setSearchValue={setSearchTeamValue}
        />
        <StyledSelectVisible
          label="List"
          active={
            <>
              <ListIcon name="list" width={16} height={16} color="white" />
              <Name>{listTitle}</Name>
            </>
          }
          options={listOptionsRenderer}
          searchPlaceholder="Search by lists…"
          searchValue={searchListValue}
          setSearchValue={setSearchListValue}
        />
      </ListsWrapper>
      <ButtonsWrapper>
        <ButtonStyled color="white" onClick={closeModal}>
          Cancel
        </ButtonStyled>
        <Button
          onClick={handleClickAccept}
          disabled={
            checkedListId === item.listId ||
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

export { MoveModal };
