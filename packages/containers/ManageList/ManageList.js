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
import {
  LIST_WORKFLOW_EDIT_MODE,
  LIST_WORKFLOW_CREATE_MODE,
} from '@caesar/common/constants';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.lightBlue};
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
  letter-spacing: 1px;
  color: ${({ theme }) => theme.black};
`;

const Description = styled.div`
  font-size: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.black};
  margin-bottom: 25px;
`;

const ManageListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.white};
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
      mode: LIST_WORKFLOW_CREATE_MODE,
    });
  };

  handleClickEditList = listId => () => {
    this.setState(
      {
        isVisibleModal: true,
        mode: LIST_WORKFLOW_EDIT_MODE,
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
            list={mode === LIST_WORKFLOW_CREATE_MODE ? [] : workInProgressList}
            mode={mode}
            onSubmit={
              mode === LIST_WORKFLOW_CREATE_MODE
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
