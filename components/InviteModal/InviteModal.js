import React, { Component } from 'react';
import styled from 'styled-components';
import memoize from 'memoize-one';
import { PERMISION_WRITE, PERMISION_READ } from 'common/constants';
import Member from './Member';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { ModalTitle } from '../ModalTitle';

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
    list.filter(({ name }) => name.includes(filterText)),
  );

  handleSubmit = event => {
    event.preventDefault();

    const { onClickInvite = Function.prototype } = this.props;
    const { invited } = this.state;

    onClickInvite(invited);
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
      invited: [...prevState.invited, { userId, access: PERMISION_WRITE }],
    }));
  };

  handlePermissionChange = userId => value => {
    this.setState(prevState => ({
      ...prevState,
      invited: prevState.invited.reduce((acc, item) => {
        if (item.userId === userId) {
          acc.push({
            ...item,
            access: value ? PERMISION_READ : PERMISION_WRITE,
          });
        } else {
          acc.push(item);
        }

        return acc;
      }, []),
    }));
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
    };
  }

  renderMemberList() {
    const { members } = this.props;
    const { filterText, invited } = this.state;
    const filteredMembers = this.filter(members, filterText);
    const invitesByUserId = invited.reduce((acc, invite) => {
      acc[invite.userId] = invite;
      return acc;
    }, {});

    return filteredMembers.map(({ id, ...member }) => {
      const isReadOnly =
        invitesByUserId[id] && invitesByUserId[id].access === PERMISION_READ;
      return (
        <Member
          key={id}
          {...member}
          isReadOnly={isReadOnly}
          isInvited={Object.keys(invitesByUserId).includes(id)}
          onClickPermissionChange={this.handlePermissionChange(id)}
          onClickAdd={this.handleClickAdd(id)}
          onClickRemove={this.handleClickRemove(id)}
        />
      );
    });
  }

  render() {
    const { filterText } = this.state;
    const { onCancel } = this.props;

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
        <ListWrapper>
          <ListTitle>Team members</ListTitle>
          <MembersWrapper>{this.renderMemberList()}</MembersWrapper>
        </ListWrapper>
        <ButtonsWrapper>
          <Button onClick={this.handleSubmit}>INVITE</Button>
        </ButtonsWrapper>
      </Modal>
    );
  }
}

export default InviteModal;
