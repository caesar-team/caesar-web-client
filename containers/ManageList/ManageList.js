import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { Layout, Modal, message } from 'antd';
import Link from 'next/link';
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
`;

const TopWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #eaeaea;
`;

const LogoWrapper = styled.div`
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 240px;
`;

const StyledIcon = styled(Icon)`
  > svg {
    width: 88px;
    height: 16px;
  }
`;

const MiddleColumnWrapper = styled(Layout)`
  display: flex;
  flex-direction: column;
  background: #fff;
  border-left: 1px solid #eaeaea;
  border-right: 1px solid #eaeaea;
`;

const ManageListWrapper = styled.div`
  padding: 0 60px;
`;

const ReturnTo = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0 20px 60px;
  cursor: pointer;
`;

const ReturnLink = styled.a`
  font-size: 18px;
  color: #888b90;
  margin-left: 10px;
`;

class ManageListContainer extends Component {
  state = this.prepareInitialState();

  newListFormRef = formRef => {
    this.formRef = formRef;
  };

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
    const {
      props: { form },
    } = this.formRef;
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
        form.setFields({
          label: {
            value: label,
            errors: errors.label.map(errorText => new Error(errorText)),
          },
        });
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
            </LogoWrapper>
            <Header user={user} />
          </TopWrapper>
          <MiddleColumnWrapper>
            <ReturnTo>
              <Icon type="left" />
              <Link href="/">
                <ReturnLink>Return to dashboard</ReturnLink>
              </Link>
            </ReturnTo>
            <ManageListWrapper>
              <ManageList
                list={postList}
                onClickCreateList={this.handleClickCreateList}
                onClickEditList={this.handleClickEditList}
                onClickRemoveList={this.handleClickRemovePost}
              />
            </ManageListWrapper>
          </MiddleColumnWrapper>
        </Wrapper>
        {isVisibleModal && (
          <ListFormModal
            list={workInProgressList}
            wrappedComponentRef={this.newListFormRef}
            onCreate={this.handleCreateList}
            onUpdate={this.handleUpdateList}
            onCancel={this.handleCancel}
          />
        )}
      </Fragment>
    );
  }
}

export default ManageListContainer;
