import React, { Component } from 'react';
import styled from 'styled-components';
import memoize from 'memoize-one';
import { PERMISSION_WRITE, PERMISSION_READ } from 'common/constants';
import Member from './Member';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Icon } from '../Icon';
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

const waitIdle = () => new Promise(requestIdleCallback);

class InviteModal extends Component {
  state = {
    filterText: '',
  };

  filter = memoize((members, filterText) =>
    Object.values(members).filter(({ email }) => email.includes(filterText)),
  );

  handleChange = event => {
    event.preventDefault();

    this.setState({
      filterText: event.target.value,
    });
  };

  handleClickAdd = userId => () => {
    const { onClickInvite } = this.props;

    onClickInvite(userId);
  };

  handleClickAddNewInvite = async () => {
    const { onClickAddNewMember } = this.props;
    const { filterText } = this.state;

    this.setState({
      filterText: '',
    });

    await waitIdle();

    onClickAddNewMember(filterText);
  };

  handleChangePermission = childItemId => event => {
    const { checked } = event.currentTarget;
    const { onChangePermission } = this.props;

    onChangePermission(
      childItemId,
      checked ? PERMISSION_READ : PERMISSION_WRITE,
    );
  };

  handleClickRemove = childItemId => () => {
    const { onRemoveInvite } = this.props;

    onRemoveInvite(childItemId);
  };

  renderMemberList(filteredMembers) {
    const { invited } = this.props;
    const invitesByUserId = invited.reduce((accumulator, invite) => {
      if (!invite) {
        return accumulator;
      }

      return { ...accumulator, [invite.userId]: invite };
    }, {});

    return filteredMembers.map(({ id, ...member }) => {
      const childItem = invitesByUserId[id];
      const childItemId = childItem ? childItem.id : null;
      const isReadOnly =
        invitesByUserId[id] && invitesByUserId[id].access === PERMISSION_READ;

      return (
        <Member
          key={id}
          {...member}
          isReadOnly={isReadOnly}
          isInvited={Object.keys(invitesByUserId).includes(id)}
          onClickPermissionChange={this.handleChangePermission(childItemId)}
          onClickAdd={this.handleClickAdd(id)}
          onClickRemove={this.handleClickRemove(childItemId)}
        />
      );
    });
  }

  render() {
    const { filterText } = this.state;
    const { members, onCancel } = this.props;

    const filteredMembers = this.filter(members, filterText);
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
        <ListWrapper>
          <ListTitle>Team members</ListTitle>
          <MembersWrapper>
            <Scrollbar autoHeight autoHeightMax={400}>
              {this.renderMemberList(filteredMembers)}
            </Scrollbar>
          </MembersWrapper>
        </ListWrapper>
      </Modal>
    );
  }
}

export default InviteModal;
