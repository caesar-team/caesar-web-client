import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { Layout, Modal, message } from 'antd';
import { Header, ManageList, ListFormModal, Icon } from 'components';
import { postCreateList, updateList, removeList } from 'common/api';
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
import { initialListData } from './utils';

const Wrapper = styled(Layout)`
  height: 100vh;
  background-color: ${({ theme }) => theme.lightBlue};
`;

const TopWrapper = styled.div`
  display: flex;
  min-height: 70px;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-bottom: ${({ theme }) => theme.gallery};
`;

const LogoWrapper = styled.div`
  display: flex;
  width: 115px;
  margin-left: 60px;
  justify-content: center;
  align-items: center;
`;

const ManageListWrapper = styled.div`
  width: 100%;
  max-width: 1060px;
  padding: 30px 20px 0;
  margin: 0 auto;
`;

class ManageListContainer extends Component {
  state = this.prepareInitialState();

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

  handleUpdateList = async ({ label }) => {
    const {
      props: { form },
    } = this.formRef;
    const {
      workInProgressList: { id: listId },
    } = this.state;

    try {
      await updateList(listId, {
        label,
      });

      form.resetFields();

      this.setState(prevState => ({
        isVisibleModal: false,
        workInProgressList: null,
        list: updateNode(prevState.list, listId, {
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
        form.setFields({
          label: {
            value: label,
            errors: errors.label.map(errorText => new Error(errorText)),
          },
        });
      }
    }
  };

  handleClickRemovePost = listId => () => {
    Modal.confirm({
      centered: true,
      title: 'Warning',
      content: 'Are you sure you want to delete the list?',
      okText: 'Remove',
      cancelText: 'Cancel',
      onOk: this.handleRemoveList(listId),
      okButtonProps: { type: 'danger', size: 'large' },
      cancelButtonProps: { size: 'large' },
    });
  };

  handleRemoveList = listId => async () => {
    const { list } = this.state;

    const { label } = findNode(list, listId).model;

    try {
      await removeList(listId);
      message.success(`The list «${label}» was removed.`);

      this.setState(prevState => ({
        ...prevState,
        list: removeNode(prevState.list, listId),
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

  prepareInitialState() {
    const { list } = this.props;

    return {
      isVisibleModal: false,
      workInProgressList: null,
      list: createTree(list[1]),
    };
  }

  preparePostList() {
    const { list } = this.state;

    return list.model.children.map(({ id, label, children }) => ({
      id,
      label,
      count: children.length,
      shared: children.reduce((acc, post) => [...acc, ...post.shared], []),
    }));
  }

  render() {
    const { user } = this.props;
    const { isVisibleModal, workInProgressList } = this.state;

    const postList = this.preparePostList();

    return (
      <Fragment>
        <Wrapper>
          <TopWrapper>
            <LogoWrapper>
              <Icon name="logo" height={25} width={120} />
            </LogoWrapper>
            <Header user={user} />
          </TopWrapper>
          <ManageListWrapper>
            <ManageList
              list={postList}
              onClickCreateList={this.handleClickCreateList}
              onClickEditList={this.handleClickEditList}
              onClickRemoveList={this.handleClickRemovePost}
            />
          </ManageListWrapper>
        </Wrapper>
        {isVisibleModal && (
          <ListFormModal
            list={workInProgressList}
            onCreate={this.handleCreateList}
            onCancel={this.handleCancel}
          />
        )}
      </Fragment>
    );
  }
}

export default ManageListContainer;
