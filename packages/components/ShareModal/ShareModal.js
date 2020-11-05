import React, { useState } from 'react';
import { useEffectOnce, useUpdateEffect } from 'react-use';
import { useSelector } from 'react-redux';
import copy from 'copy-text-to-clipboard';
import styled from 'styled-components';
import { useNotification } from '@caesar/common/hooks';
import { currentUserDataSelector } from '@caesar/common/selectors/currentUser';
import { Modal, ModalTitle } from '../Modal';
import { UserSearchInput } from '../Input';
import { Section } from '../Section';
import { MemberList } from '../MemberList';
import { Button } from '../Button';
import { AnonymousLink, TeamList } from './components';
import { getAnonymousLink } from './utils';
import { Scrollbar } from '../Scrollbar';
import { ListItem } from '../List';
import { TextWithLines } from '../TextWithLines';

const Row = styled.div`
  margin-bottom: 20px;
`;

const StyledMemberList = styled(MemberList)`
  ${MemberList.Member} {
    background-color: ${({ theme }) => theme.color.alto};
    margin-bottom: 4px;

    &:last-of-type {
      margin-bottom: 0;
    }
  }
`;

const StyledModalTitle = styled(ModalTitle)`
  justify-content: flex-start;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 40px;
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

export const ShareModal = ({
  sharedMembers,
  items,
  teams,
  anonymousLink = [],
  isMultiMode = false,
  onActivateLink = Function.prototype,
  onDeactivateLink = Function.prototype,
  onShare = Function.prototype,
  onCancel = Function.prototype,
  onRevokeAccess = Function.prototype,
  onRemove = Function.prototype,
}) => {
  const [members, setMembers] = useState([]);
  const [teamIds, setTeamIds] = useState([]);
  const [isOpenedInvited, setOpenedInvited] = useState(false);
  const [link, setLink] = useState(null);
  const [isGeneratingLink, setGeneratingLink] = useState(false);
  const currentUser = useSelector(currentUserDataSelector);
  const notification = useNotification();

  const handleAddMember = member => {
    setMembers([...members, member]);
  };

  const handleRemoveMember = member => () => {
    setMembers(members.filter(({ id }) => id !== member.id));
  };

  const handleClickDone = () => {
    onShare(members, teamIds);
  };

  const handleToggleAnonymousLink = () => {
    if (link) {
      onDeactivateLink();
    } else {
      setGeneratingLink(true);
      onActivateLink();
    }
  };

  const handleUpdateAnonymousLink = () => {
    setGeneratingLink(true);
    onActivateLink();
  };

  const handleCopy = () => {
    copy(link);

    notification.show({
      text: `The shared link has been copied`,
    });
  };

  const handleDeleteItem = itemId => () => {
    onRemove(itemId);
  };

  useEffectOnce(() => {
    if (anonymousLink) {
      setLink(getAnonymousLink(anonymousLink));
    }
  });

  useUpdateEffect(() => {
    if (isGeneratingLink) {
      setGeneratingLink(false);
    }
  }, [link, setLink]);

  useUpdateEffect(() => {
    setLink(anonymousLink ? getAnonymousLink(anonymousLink) : null);
  }, [anonymousLink]);

  const searchedBlackListMemberIds = [
    currentUser.id,
    ...members.map(({ id }) => id),
    ...sharedMembers.map(({ id }) => id),
  ];

  const shouldShowAddedMembers = members.length > 0;
  const shouldShowTeamsSection = false;
  const shouldShowSharedMembers = sharedMembers.length > 0;

  return (
    <Modal
      isOpened
      width={640}
      onRequestClose={onCancel}
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
    >
      <StyledModalTitle>
        {isMultiMode ? 'Share selected items' : 'Share the item'}
      </StyledModalTitle>
      <Row>
        <UserSearchInput
          blackList={searchedBlackListMemberIds}
          onClickAdd={handleAddMember}
        />
      </Row>
      {shouldShowAddedMembers && (
        <Row>
          <StyledMemberList
            maxHeight={200}
            members={members}
            controlType="remove"
            onClickRemove={handleRemoveMember}
          />
        </Row>
      )}
      {shouldShowTeamsSection && (
        <Row>
          <TeamList teams={teams} teamIds={teamIds} setTeamIds={setTeamIds} />
        </Row>
      )}
      {shouldShowSharedMembers && (
        <Row>
          <Section
            name={`Invited (${sharedMembers.length})`}
            isOpened={isOpenedInvited}
            onToggleSection={() => setOpenedInvited(!isOpenedInvited)}
          >
            <StyledMemberList
              maxHeight={180}
              members={sharedMembers}
              controlType="revoke"
              onClickRevokeAccess={onRevokeAccess}
            />
          </Section>
        </Row>
      )}
      {/* TODO: Implement anonym sharing
      {!isMultiMode && (
        <Row>
          <AnonymousLink
            link={link}
            isLoading={isGeneratingLink}
            onToggle={handleToggleAnonymousLink}
            onCopy={handleCopy}
            onUpdate={handleUpdateAnonymousLink}
          />
        </Row>
      )} */}
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
      <ButtonsWrapper>
        <ButtonStyled color="white" onClick={onCancel}>
          Cancel
        </ButtonStyled>
        <Button onClick={handleClickDone}>Done</Button>
      </ButtonsWrapper>
    </Modal>
  );
};
