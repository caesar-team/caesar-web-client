import React, { Component } from 'react';
import styled from 'styled-components';
import memoize from 'memoize-one';
import Member from './Member';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Icon } from '../Icon';
import { Button } from '../Button';

const Title = styled.div`
  display: flex;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.black};
  text-transform: uppercase;
  margin-bottom: 25px;
`;

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
    const { invitedIds } = this.state;

    onClickInvite(invitedIds);
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
      invitedIds: [...prevState.invitedIds, userId],
    }));
  };

  handleClickRemove = userId => () => {
    this.setState(prevState => ({
      ...prevState,
      invitedIds: prevState.invitedIds.filter(id => id !== userId),
    }));
  };

  prepareInitialState() {
    const { shared } = this.props;

    return {
      filterText: '',
      invitedIds: shared,
    };
  }

  renderMemberList() {
    const { members } = this.props;
    const { filterText, invitedIds } = this.state;

    const filteredMembers = this.filter(members, filterText);

    return filteredMembers.map(({ id, ...member }) => (
      <Member
        key={id}
        {...member}
        isInvited={invitedIds.includes(id)}
        onClickAdd={this.handleClickAdd(id)}
        onClickRemove={this.handleClickRemove(id)}
      />
    ));
  }

  render() {
    const { filterText } = this.state;

    return (
      <Modal isOpen minWidth={420}>
        <Title>Invite</Title>
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
