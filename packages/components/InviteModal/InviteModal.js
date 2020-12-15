import React, { Component } from 'react';
import styled from 'styled-components';
import { Modal, ModalTitle } from '../Modal';
import { UserSearchInput } from '../Input';
import { MemberList } from '../MemberList';
import { Button } from '../Button';

const Wrapper = styled.div`
  position: relative;
`;

const MemberListStyled = styled(MemberList)`
  margin-bottom: 30px;

  ${MemberList.Member} {
    background-color: ${({ theme }) => theme.color.snow};
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
      users: [...prevState.users, member],
    }));
  };

  handleRemoveMember = member => () => {
    this.setState(prevState => ({
      ...prevState,
      users: prevState.users.filter(({ id }) => id !== member.id),
    }));
  };

  handleChangeRole = changedRoleMember => (_, role) => {
    this.setState(prevState => ({
      ...prevState,
      users: prevState.users.map(member =>
        member.id === changedRoleMember.id ? { ...member, role } : member,
      ),
    }));
  };

  handleClickDone = () => {
    const { onSubmit } = this.props;
    const { users } = this.state;

    onSubmit(users);
  };

  prepareInitialState() {
    return {
      users: [],
    };
  }

  render() {
    const { members, currentUser, onCancel } = this.props;
    const { users } = this.state;

    const shouldShowAddedUsers = users.length > 0;

    const searchedBlackListMemberIds = [
      currentUser.id,
      ...users.map(({ id }) => id),
      ...members.map(({ userId }) => userId),
    ];

    return (
      <Modal
        isOpened
        width={640}
        onRequestClose={onCancel}
        shouldCloseOnEsc
        shouldCloseOnOverlayClick
      >
        <Wrapper>
          <ModalTitle>Add Members</ModalTitle>
          <UserSearchInput
            blackList={searchedBlackListMemberIds}
            autoFocus
            onClickAdd={this.handleAddMember}
          />
          {shouldShowAddedUsers && (
            <MemberListStyled
              maxHeight={200}
              members={users}
              isNewMember
              scrollbarDisplayCondition={users.length > 4}
              controlType="remove"
              onClickRemove={this.handleRemoveMember}
              onChangeRole={this.handleChangeRole}
            />
          )}
          <ButtonsWrapper>
            <ButtonStyled color="white" onClick={onCancel}>
              Cancel
            </ButtonStyled>
            <Button onClick={this.handleClickDone}>Done</Button>
          </ButtonsWrapper>
        </Wrapper>
      </Modal>
    );
  }
}

export default InviteModal;
