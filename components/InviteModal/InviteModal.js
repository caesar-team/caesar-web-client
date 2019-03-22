import React, { Component } from 'react';
import styled from 'styled-components';
import memoize from 'memoize-one';
import { PERMISSION_WRITE, PERMISSION_READ } from 'common/constants';
import Member from './Member';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { ModalTitle } from '../ModalTitle';
import { Scrollbar } from '../Scrollbar';

const StyledInput = styled(Input)`
  ${Input.InputField} {
    height: 50px;
    border: 1px solid ${({ theme }) => theme.gallery};
    border-radius: 3px;
    padding: 15px 20px 15px 54px;
    font-size: 16px;
  }
`;

const EmailBox = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 15px;
  background-color: ${({ theme }) => theme.lightBlue};
  margin-bottom: 5px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SharedItemEmail = styled.div`
  margin-right: auto;
  font-size: 16px;
  color: ${({ theme }) => theme.black};
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SharedItemRemove = styled.button`
  border: none;
  background: none;
  padding: 4px;
  margin-left: 20px;
  color: ${({ theme }) => theme.gray};
  cursor: pointer;
  transition: 0.25s;

  &:hover {
    color: ${({ theme }) => theme.black};
  }
`;

const StyledIcon = styled(Icon)`
  fill: ${({ theme }) => theme.gallery};
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const ListTitle = styled.div`
  font-size: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.emperor};
`;

const AddInviteBox = styled.div`
  cursor: pointer;
  box-shadow: 0 11px 23px 0 rgba(0, 0, 0, 0.1);
`;

const AddInvite = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
`;

const InvitedEmail = styled.div`
  font-weight: bold;
  margin-left: 3px;
`;

const StyledIconInvite = styled(Icon)`
  margin-right: 20px;
`;

const MembersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 400px;
  margin-top: 15px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 0 0;
`;

class InviteModal extends Component {
  state = this.prepareInitialState();

  filter = memoize((list, filterText) =>
    list.filter(
      ({ email, name }) =>
        name.includes(filterText) || email.includes(filterText),
    ),
  );

  handleSubmit = event => {
    event.preventDefault();

    const { onClickInvite = Function.prototype } = this.props;
    const { invited, newInvites } = this.state;

    onClickInvite(invited, newInvites);
  };

  handleChange = event => {
    event.preventDefault();

    this.setState({
      filterText: event.target.value,
    });
  };

  handleClickAdd = userId => () => {
    this.setState(prevState => ({
      ...prevState,
      invited: [...prevState.invited, { userId, access: PERMISSION_WRITE }],
    }));
  };

  handleClickAddNewInvite = () => {
    this.setState(prevState => ({
      newInvites: [...prevState.newInvites, prevState.filterText],
      filterText: '',
    }));
  };

  handleRemoveInvite = email => () => {
    this.setState(prevState => ({
      newInvites: prevState.newInvites.filter(
        inviteEmail => inviteEmail !== email,
      ),
    }));
  };

  handleChangePermission = userId => event => {
    const { checked } = event.currentTarget;
    const { onChangePermission } = this.props;

    this.setState(
      prevState => ({
        ...prevState,
        invited: prevState.invited.reduce((acc, item) => {
          if (item.userId === userId) {
            acc.push({
              ...item,
              access: checked ? PERMISSION_READ : PERMISSION_WRITE,
            });
          } else {
            acc.push(item);
          }

          return acc;
        }, []),
      }),
      () => {
        onChangePermission(userId);
      },
    );
  };

  handleClickRemove = userId => () => {
    this.setState(prevState => ({
      ...prevState,
      invited: prevState.invited.filter(invite => invite.userId !== userId),
    }));
  };

  prepareInitialState() {
    const { invited } = this.props;

    return {
      filterText: '',
      invited,
      newInvites: [],
    };
  }

  renderNewInvites() {
    const { newInvites } = this.state;

    return newInvites.map((email, index) => (
      <EmailBox key={index}>
        <SharedItemEmail>{email}</SharedItemEmail>
        <SharedItemRemove>
          <Icon
            name="close"
            width={14}
            height={14}
            isInButton
            onClick={this.handleRemoveInvite(email)}
          />
        </SharedItemRemove>
      </EmailBox>
    ));
  }

  renderMemberList(filteredMembers) {
    const { invited } = this.state;
    const invitesByUserId = invited.reduce((acc, invite) => {
      acc[invite.userId] = invite;
      return acc;
    }, {});

    return filteredMembers.map(({ id, ...member }) => {
      const isReadOnly =
        invitesByUserId[id] && invitesByUserId[id].access === PERMISSION_READ;

      return (
        <Member
          key={id}
          {...member}
          isReadOnly={isReadOnly}
          isInvited={Object.keys(invitesByUserId).includes(id)}
          onClickPermissionChange={this.handleChangePermission(id)}
          onClickAdd={this.handleClickAdd(id)}
          onClickRemove={this.handleClickRemove(id)}
        />
      );
    });
  }

  render() {
    const { filterText, newInvites } = this.state;
    const { members, onCancel } = this.props;

    const filteredMembers = this.filter(members, filterText);
    const shouldShowNewInvites = newInvites.length > 0;
    const shouldShowAddInviteOption =
      !filteredMembers.length && !!filterText && filterText.includes('@');

    return (
      <Modal
        isOpen
        width={560}
        onRequestClose={onCancel}
        shouldCloseOnEsc
        shouldCloseOnOverlayClick
      >
        <ModalTitle>Invite</ModalTitle>
        <StyledInput
          placeholder="name@4xxi.com"
          value={filterText}
          onChange={this.handleChange}
          prefix={<StyledIcon name="search" width={20} height={20} />}
        />
        {shouldShowAddInviteOption && (
          <AddInviteBox onClick={this.handleClickAddNewInvite}>
            <AddInvite>
              <StyledIconInvite name="plus" width={16} height={16} />
              Invite <InvitedEmail>{filterText}</InvitedEmail>
            </AddInvite>
          </AddInviteBox>
        )}
        {shouldShowNewInvites && (
          <ListWrapper>
            <ListTitle>New Invites</ListTitle>
            {this.renderNewInvites()}
          </ListWrapper>
        )}
        <ListWrapper>
          <ListTitle>Team members</ListTitle>
          <MembersWrapper>
            <Scrollbar autoHeight autoHeightMax={400}>
              {this.renderMemberList(filteredMembers)}
            </Scrollbar>
          </MembersWrapper>
        </ListWrapper>
        <ButtonsWrapper>
          <Button onClick={this.handleSubmit}>INVITE</Button>
        </ButtonsWrapper>
      </Modal>
    );
  }
}

export default InviteModal;
