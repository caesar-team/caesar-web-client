import React, { useState } from 'react';
import { useEffectOnce, useUpdateEffect } from 'react-use';
import { useSelector } from 'react-redux';
import copy from 'copy-text-to-clipboard';
import styled from 'styled-components';
import { userDataSelector } from '@caesar/common/selectors/user';
import { Modal, ModalTitle, ModalSubtitle } from '../Modal';
import { UserSearchInput } from '../Input';
import { Section } from '../Section';
import { MemberList } from '../MemberList';
import { Button } from '../Button';
import { AnonymousLink, TeamList } from './components';
import { getAnonymousLink } from './utils';

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

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 40px;
`;

const ButtonStyled = styled(Button)`
  margin-right: 16px;
`;

export const ShareModal = ({
  notification,
  sharedMembers,
  teams,
  withAnonymousLink,
  anonymousLink = [],
  onActivateLink,
  onDeactivateLink,
  onShare,
  onCancel,
  onRevokeAccess,
}) => {
  const [members, setMembers] = useState([]);
  const [teamIds, setTeamIds] = useState([]);
  const [isOpenedInvited, setOpenedInvited] = useState(false);
  const [link, setLink] = useState(null);
  const [isGeneratingLink, setGeneratingLink] = useState(false);
  const user = useSelector(userDataSelector);

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
    user.id,
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
      <ModalTitle>Share</ModalTitle>
      <ModalSubtitle>Share item with team</ModalSubtitle>
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
      {withAnonymousLink && (
        <Row>
          <AnonymousLink
            link={link}
            isLoading={isGeneratingLink}
            onToggle={handleToggleAnonymousLink}
            onCopy={handleCopy}
            onUpdate={handleUpdateAnonymousLink}
          />
        </Row>
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
