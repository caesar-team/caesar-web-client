import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { userDataSelector } from '@caesar/common/selectors/user';
import { Modal, ModalTitle, ModalSubtitle } from '../Modal';
import { UserSearchInput } from '../Input';
import { MemberList } from '../MemberList';
import { Button } from '../Button';

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

export const ShareModal = ({ sharedMembers, onShare, onCancel }) => {
  const [members, setMembers] = useState([]);
  const [teamIds, setTeamIds] = useState([]);
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
      <ButtonsWrapper>
        <ButtonStyled color="white" onClick={onCancel}>
          Cancel
        </ButtonStyled>
        <Button onClick={handleClickDone}>Done</Button>
      </ButtonsWrapper>
    </Modal>
  );
};
