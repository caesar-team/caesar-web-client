import React, { Component } from 'react';
import styled from 'styled-components';
import { Modal, Input, List, Button } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import memoize from 'memoize-one';
import { Icon } from '../Icon';
import Member from './Member';

const StyledModal = styled(Modal)`
  .ant-modal-title {
    font-size: 24px;
    color: #2e2f31;
    text-align: center;
  }
`;

const Scrollbar = styled(Scrollbars)`
  height: 400px !important;
`;

const StyledInput = styled(Input)`
  height: 60px;

  input {
    font-size: 18px;
    padding-left: 54px !important;
  }
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
`;

const ListTitle = styled.div`
  font-size: 18px;
  color: #888b90;
`;

const MembersWrapper = styled.div`
  min-height: 400px;
  max-height: 400px;
  overflow-y: auto;
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

  render() {
    const { members, onCancel = Function.prototype } = this.props;
    const { filterText, invitedIds } = this.state;

    const filteredMembers = this.filter(members, filterText);

    return (
      <StyledModal
        visible
        centered
        title="Invite"
        footer={false}
        onCancel={onCancel}
      >
        <StyledInput
          placeholder="name@4xxi.com"
          prefix={<Icon type="search" size="large" />}
          value={filterText}
          onChange={this.handleChange}
        />
        <ListWrapper>
          <ListTitle>All members</ListTitle>
          <MembersWrapper>
            <Scrollbar>
              <List
                bordered={false}
                size="large"
                dataSource={filteredMembers}
                renderItem={({ id, ...props }) => (
                  <Member
                    key={id}
                    {...props}
                    isInvited={invitedIds.includes(id)}
                    onClickAdd={this.handleClickAdd(id)}
                    onClickRemove={this.handleClickRemove(id)}
                  />
                )}
              />
            </Scrollbar>
          </MembersWrapper>
        </ListWrapper>
        <ButtonsWrapper>
          <Button type="primary" onClick={this.handleSubmit} size="large">
            Invite
          </Button>
        </ButtonsWrapper>
      </StyledModal>
    );
  }
}

export default InviteModal;
