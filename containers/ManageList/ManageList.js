import React, { Component } from 'react';
import styled from 'styled-components';
import {
  ManageList,
  ListFormModal,
  ConfirmModal,
  withNotification,
  Button,
} from 'components';
import {
  postCreateList,
  patchList,
  removeList,
  getList,
  getUsers,
  getUserSelf,
  patchListSort,
} from 'common/api';
import {
  LIST_WORKFLOW_EDIT_MODE,
  LIST_WORKFLOW_CREATE_MODE,
  LIST_TYPE,
} from 'common/constants';
import { initialListData, memberAdapter } from './utils';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.lightBlue};
  width: 100%;
  padding: 60px;
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

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const fixSort = lists => lists.map((list, index) => ({ ...list, sort: index }));

const update = (list, listId, data) => {
  const index = list.findIndex(({ id }) => id === listId);

  return [
    ...list.slice(0, index),
    {
      ...list[listId],
      ...data,
    },
    ...list.slice(index + 1),
  ];
};

class ManageListContainer extends Component {
  state = this.prepareInitialState();

  async componentDidMount() {
    const { data: list } = await getList();
    const { data: user } = await getUserSelf();
    const { data: members } = await getUsers();

    this.setState({
      list: list[1],
      user,
      members: memberAdapter(members),
    });
  }

  handleClickCreateList = () => {
    this.setState({
      isVisibleModal: true,
      workInProgressList: {
        mode: LIST_WORKFLOW_CREATE_MODE,
        ...initialListData(),
      },
    });
  };

  handleClickEditList = listId => () => {
    const { list } = this.state;

    const { label } = list.children.find(({ id }) => id === listId);

    this.setState({
      isVisibleModal: true,
      workInProgressList: {
        id: listId,
        label,
        mode: LIST_WORKFLOW_EDIT_MODE,
      },
    });
  };

  handleCreateList = async ({ label }) => {
    const { list } = this.state;

    const listsNodeId = list.id;

    try {
      const {
        data: { id: listId },
      } = await postCreateList({
        label,
        parentId: listsNodeId,
      });

      this.setState(prevState => ({
        isVisibleModal: false,
        workInProgressList: null,
        list: {
          ...prevState.list,
          children: fixSort([
            {
              id: listId,
              label,
              sort: 0,
              type: LIST_TYPE,
              children: [],
            },
            ...prevState.list.children,
          ]),
        },
      }));
    } catch (e) {
      const {
        response: {
          data: { errors },
        },
      } = e;

      if (errors && errors.label) {
        console.log(errors.label);
      }
    }
  };

  handleEditList = async ({ label }) => {
    const { workInProgressList } = this.state;

    try {
      await patchList(workInProgressList.id, {
        label,
      });

      this.setState(prevState => ({
        isVisibleModal: false,
        workInProgressList: null,
        list: {
          ...prevState.list,
          children: update(prevState.list.children, workInProgressList.id, {
            id: workInProgressList.id,
            label,
            type: LIST_TYPE,
            children: [],
          }),
        },
      }));
    } catch (e) {
      const {
        response: {
          data: { errors },
        },
      } = e;

      if (errors && errors.label) {
        console.log(errors.label);
      }
    }
  };

  handleClickRemovePost = listId => () => {
    this.setState({
      removingListId: listId,
    });
  };

  handleRemoveList = async () => {
    const { notification } = this.props;
    const { list, removingListId } = this.state;

    const { label } = list.children.find(({ id }) => id === removingListId);

    try {
      await removeList(removingListId);

      notification.show({
        text: `The list «${label}» was removed.`,
        icon: 'ok',
      });

      this.setState(prevState => ({
        ...prevState,
        removingListId: null,
        list: {
          ...prevState.list,
          children: fixSort(
            prevState.list.children.filter(({ id }) => id !== removingListId),
          ),
        },
      }));
    } catch (e) {
      //
    }
  };

  handleChangeSort = (listId, sourceIndex, destinationIndex) => {
    this.setState(
      prevState => ({
        list: {
          ...prevState.list,
          children: fixSort(
            reorder(prevState.list.children, sourceIndex, destinationIndex),
          ),
        },
      }),
      () => patchListSort(listId, { sort: destinationIndex }),
    );
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
      removingListId: null,
      isVisibleModal: false,
      workInProgressList: null,
      list: null,
      members: null,
    };
  }

  preparePostList() {
    const { list } = this.state;

    return list.children
      .map(({ id, label, sort, children }) => ({
        id,
        label,
        sort,
        count: children.length,
        invited: children.reduce((acc, post) => [...acc, ...post.invited], []),
      }))
      .sort((a, b) => a.sort - b.sort);
  }

  render() {
    const {
      list,
      isVisibleModal,
      workInProgressList,
      members,
      removingListId,
    } = this.state;

    if (!list) {
      return null;
    }

    const postList = this.preparePostList();

    return (
      <Wrapper>
        <TopWrapper>
          <Title>Lists</Title>
          <Button
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
            list={postList}
            members={members}
            onChangeSort={this.handleChangeSort}
            onClickEditList={this.handleClickEditList}
            onClickRemoveList={this.handleClickRemovePost}
          />
        </ManageListWrapper>
        {isVisibleModal && (
          <ListFormModal
            list={workInProgressList}
            onSubmit={
              workInProgressList.mode === LIST_WORKFLOW_CREATE_MODE
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
