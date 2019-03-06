import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import {
  Layout,
  ManageList,
  ListFormModal,
  ConfirmModal,
  withNotification,
} from 'components';
import {
  postCreateList,
  patchList,
  removeList,
  getList,
  getUsers,
  getUserSelf,
} from 'common/api';
import {
  createTree,
  removeNode,
  addNode,
  findNode,
  updateNode,
} from 'common/utils/tree';
import {
  LIST_WORKFLOW_EDIT_MODE,
  LIST_WORKFLOW_CREATE_MODE,
  LIST_TYPE,
} from 'common/constants';
import { initialListData, memberAdapter } from './utils';

const ManageListWrapper = styled.div`
  width: 100%;
  max-width: 1060px;
  padding: 30px 20px 0;
  margin: 0 auto;
`;

class ManageListContainer extends Component {
  state = this.prepareInitialState();

  async componentDidMount() {
    const { data: list } = await getList();
    const { data: user } = await getUserSelf();
    const { data: members } = await getUsers();

    this.setState({
      list: createTree(list[1]),
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

    const { label } = findNode(list, listId).model;

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

    const listsNodeId = list.model.id;

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
        list: addNode(prevState.list, listsNodeId, {
          id: listId,
          label,
          type: LIST_TYPE,
          children: [],
        }),
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
        list: updateNode(prevState.list, workInProgressList.id, {
          id: workInProgressList.id,
          label,
          type: LIST_TYPE,
          children: [],
        }),
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

    const { label } = findNode(list, removingListId).model;

    try {
      await removeList(removingListId);

      notification.show({
        text: `The list «${label}» was removed.`,
        icon: 'ok',
      });

      this.setState(prevState => ({
        ...prevState,
        removeListId: null,
        list: removeNode(prevState.list, removingListId),
      }));
    } catch (e) {
      //
    }
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

    return list.model.children.map(({ id, label, children }) => ({
      id,
      label,
      count: children.length,
      invited: children.reduce((acc, post) => [...acc, ...post.invited], []),
    }));
  }

  render() {
    const {
      list,
      user,
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
      <Fragment>
        <Layout user={user}>
          <ManageListWrapper>
            <ManageList
              list={postList}
              members={members}
              onClickCreateList={this.handleClickCreateList}
              onClickEditList={this.handleClickEditList}
              onClickRemoveList={this.handleClickRemovePost}
            />
          </ManageListWrapper>
        </Layout>
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
      </Fragment>
    );
  }
}

export default withNotification(ManageListContainer);
