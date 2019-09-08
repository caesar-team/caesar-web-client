import React, { Component } from 'react';
import styled from 'styled-components';
import memoizeOne from 'memoize-one';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Icon } from '../Icon';
import { ModalTitle } from '../ModalTitle';
import { MemberList } from '../MemberList';

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

const MemberListStyled = styled(MemberList)`
  margin-top: 20px;

  ${MemberList.Member} {
    padding-left: 0;
    padding-right: 0;
  }
`;

class InviteModal extends Component {
  state = this.prepareInitialState();

  filter = memoizeOne((members, filterText) =>
    members.filter(({ email }) => email.includes(filterText)),
  );

  handleChange = event => {
    event.preventDefault();

    this.setState({
      filterText: event.target.value,
    });
  };

  handleAddMember = member => () => {
    console.log('handleAddMember', member);
  };

  handleChangeRole = member => (_, role) => {
    console.log('handleChangeRole', member, role);
  };

  // handleClickAdd = userId => () => {
  //   const { onClickInvite } = this.props;
  //
  //   onClickInvite(userId);
  // };
  //
  // handleClickAddNewInvite = async () => {
  //   const { onClickAddNewMember } = this.props;
  //   const { filterText } = this.state;
  //
  //   this.setState({
  //     filterText: '',
  //   });
  //
  //   await waitIdle();
  //
  //   onClickAddNewMember(filterText);
  // };
  //
  // handleChangePermission = childItemId => event => {
  //   const { checked } = event.currentTarget;
  //   const { onChangePermission } = this.props;
  //
  //   onChangePermission(
  //     childItemId,
  //     checked ? PERMISSION_READ : PERMISSION_WRITE,
  //   );
  // };

  prepareInitialState() {
    return {
      filterText: '',
    };
  }

  render() {
    const { filterText } = this.state;
    const { members, teamId, onCancel } = this.props;

    const filteredMembers = this.filter(members, filterText);

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
        <MemberListStyled
          members={filteredMembers}
          teamId={teamId}
          controlType="invite"
          onClickAdd={this.handleAddMember}
          onChangeRole={this.handleChangeRole}
        />
      </Modal>
    );
  }
}

export default InviteModal;
