import React, { Component } from 'react';
import styled from 'styled-components';
import { Modal, ModalTitle, UserSearchInput } from '@caesar/components';
import { MemberList } from '../MemberList';
import { Button } from '../Button';

const Wrapper = styled.div`
  position: relative;
`;

const MemberListStyled = styled(MemberList)`
  margin-bottom: 30px;

  ${MemberList.Member} {
    background-color: ${({ theme }) => theme.color.lightBlue};
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
  margin-right: 20px;
`;

class InviteModal extends Component {
  state = this.prepareInitialState();

  handleAddMember = member => {
    this.setState(prevState => ({
      ...prevState,
      members: [...prevState.members, member],
    }));
  };

  handleRemoveMember = member => () => {
    this.setState(prevState => ({
      ...prevState,
      members: prevState.members.filter(({ id }) => id !== member.id),
    }));
  };

  handleChangeRole = changedRoleMember => (_, role) => {
    this.setState(prevState => ({
      ...prevState,
      members: prevState.members.map(member =>
        member.id === changedRoleMember.id ? { ...member, role } : member,
      ),
    }));
  };

  handleClickDone = () => {
    const { onSubmit } = this.props;
    const { members } = this.state;

    onSubmit(members);
  };

  prepareInitialState() {
    return {
      members: [],
    };
  }

  render() {
    const { invitedMembers, user, onCancel } = this.props;
    const { members } = this.state;

    const shouldShowAddedMembers = members.length > 0;

    const searchedBlackListMemberIds = [
      user.id,
      ...members.map(({ id }) => id),
      ...invitedMembers.map(({ id }) => id),
    ];

    return (
      <Modal
        isOpen
        width={640}
        onRequestClose={onCancel}
        shouldCloseOnEsc
        shouldCloseOnOverlayClick
      >
        <Wrapper>
          <ModalTitle>Add Members</ModalTitle>
          <UserSearchInput
            blackList={searchedBlackListMemberIds}
            onClickAdd={this.handleAddMember}
          />
          {shouldShowAddedMembers && (
            <MemberListStyled
              maxHeight={200}
              members={members}
              controlType="remove"
              onClickRemove={this.handleRemoveMember}
              onChangeRole={this.handleChangeRole}
            />
          )}
          <ButtonsWrapper>
            <ButtonStyled color="white" onClick={onCancel}>
              CANCEL
            </ButtonStyled>
            <Button onClick={this.handleClickDone}>DONE</Button>
          </ButtonsWrapper>
        </Wrapper>
      </Modal>
    );
  }
}

export default InviteModal;
