import React, { Component } from 'react';
import styled from 'styled-components';
import {
  ManageList,
  NewListModal,
  ConfirmModal,
  Button,
  TextLoader,
  withNotification,
} from '@caesar/components';
import { LIST_MODE } from '@caesar/common/constants';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.color.lightBlue};
  width: 100%;
  padding: 60px;
  position: relative;
`;

const TopWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const Title = styled.div`
  font-size: 36px;
  color: ${({ theme }) => theme.color.black};
`;

const Description = styled.div`
  font-size: 18px;
  color: ${({ theme }) => theme.color.black};
  margin-bottom: 25px;
`;

const ManageListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.color.white};
  padding: 30px;
`;

class ManageListContainer extends Component {
  state = this.prepareInitialState();

  componentDidMount() {
    this.props.fetchUserSelfRequest();
    this.props.fetchMembersRequest();

    this.props.initWorkflow();
  }

  handleClickCreateList = () => {
    this.setState({
      isVisibleModal: true,
      mode: LIST_MODE.WORKFLOW_CREATE,
    });
  };

  handleClickEditList = listId => () => {
    this.setState(
      {
        isVisibleModal: true,
        mode: LIST_MODE.WORKFLOW_EDIT,
      },
      () => this.props.setWorkInProgressListId(listId),
    );
  };

  handleCreateList = async ({ label }) => {
    this.props.createListRequest({ label });

    this.setState({
      isVisibleModal: false,
      mode: null,
    });
  };

  handleEditList = list => {
    const { workInProgressList } = this.props;

    this.props.editListRequest({ ...workInProgressList, ...list });

    this.props.notification.show({
      text: 'The list has been updated.',
    });

    this.setState({
      isVisibleModal: false,
    });
  };

  handleClickRemoveList = listId => () => {
    this.setState({
      removingListId: listId,
    });
  };

  handleRemoveList = () => {
    this.props.removeListRequest(this.state.removingListId);

    this.props.notification.show({
      text: 'The list has deleted.',
    });

    this.setState({
      removingListId: null,
    });
  };

  handleChangeSort = (listId, sourceIndex, destinationIndex) => {
    this.props.sortListRequest(listId, sourceIndex, destinationIndex);
  };

  handleCancel = () => {
    this.setState({
      isVisibleModal: false,
    });
  };

  handleCloseConfirmModal = () => {
    this.setState({
      removingListId: null,
    });
  };

  prepareInitialState() {
    return {
      mode: null,
      removingListId: null,
      isVisibleModal: false,
    };
  }

  render() {
    const { lists, members, workInProgressList, isLoading } = this.props;
    const { isVisibleModal, removingListId, mode } = this.state;

    if (isLoading) {
      return (
        <Wrapper>
          <TextLoader />
        </Wrapper>
      );
    }

    return (
      <Wrapper>
        <TopWrapper>
          <Title>Lists</Title>
          <Button
            withOfflineCheck
            onClick={this.handleClickCreateList}
            icon="plus"
            color="black"
          >
            ADD LIST
          </Button>
        </TopWrapper>
        <Description>Manage your lists</Description>
        <ManageListWrapper>
          <ManageList
            lists={lists}
            members={members}
            onChangeSort={this.handleChangeSort}
            onClickEditList={this.handleClickEditList}
            onClickRemoveList={this.handleClickRemoveList}
          />
        </ManageListWrapper>
        {isVisibleModal && (
          <NewListModal
            list={mode === LIST_MODE.WORKFLOW_CREATE ? [] : workInProgressList}
            mode={mode}
            onSubmit={
              mode === LIST_MODE.WORKFLOW_CREATE
                ? this.handleCreateList
                : this.handleEditList
            }
            onCancel={this.handleCancel}
          />
        )}
        <ConfirmModal
          isOpen={!!removingListId}
          description="Are you sure you want to delete the list?"
          onClickOk={this.handleRemoveList}
          onClickCancel={this.handleCloseConfirmModal}
        />
      </Wrapper>
    );
  }
}

export default withNotification(ManageListContainer);
