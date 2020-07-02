import React, { useState } from 'react';
import { useEffectOnce, useUpdateEffect, useCopyToClipboard } from 'react-use';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { userDataSelector } from '@caesar/common/selectors/user';
import { Modal, ModalTitle, ModalSubtitle } from '../Modal';
import { UserSearchInput } from '../Input';
import { MemberList } from '../MemberList';
import { Button } from '../Button';
import { AnonymousLink } from './components';
import { getAnonymousLink } from './utils';

const MemberListStyled = styled(MemberList)`
  margin-bottom: 40px;
  margin-top: 8px;

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
  withAnonymousLink,
  anonymousLink = [],
  onActivateLink,
  onDeactivateLink,
  onShare,
  onCancel,
}) => {
  const [members, setMembers] = useState([]);
  const [teamIds, setTeamIds] = useState([]);
  const [link, setLink] = useState(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const user = useSelector(userDataSelector);
  const [, copyToClipboard] = useCopyToClipboard();

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
      setIsGeneratingLink(true);
      onActivateLink();
    }
  };

  const handleUpdateAnonymousLink = () => {
    setIsGeneratingLink(true);
    onActivateLink();
  };

  const handleCopy = () => {
    copyToClipboard(link);

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
      setIsGeneratingLink(false);
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
      <UserSearchInput
        blackList={searchedBlackListMemberIds}
        onClickAdd={handleAddMember}
      />
      {shouldShowAddedMembers && (
        <MemberListStyled
          maxHeight={200}
          members={members}
          controlType="remove"
          onClickRemove={handleRemoveMember}
        />
      )}
      {withAnonymousLink && (
        <AnonymousLink
          link={link}
          isLoading={isGeneratingLink}
          onToggle={handleToggleAnonymousLink}
          onCopy={handleCopy}
          onUpdate={handleUpdateAnonymousLink}
        />
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
