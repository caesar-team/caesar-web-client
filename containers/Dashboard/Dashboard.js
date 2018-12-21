import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { Layout, Modal, message } from 'antd';
import deepequal from 'fast-deep-equal';
import memoize from 'memoize-one';
import * as openpgp from 'openpgp';
import { Post, PostList, Sidebar, Header, InviteModal } from 'components';
import {
  createTree,
  findNode,
  replaceNode,
  addNode,
  updateNode,
  removeNode,
} from 'common/utils/tree';
import {
  ROOT_TYPE,
  INBOX_TYPE,
  LIST_TYPE,
  TRASH_TYPE,
  POST_REVIEW_MODE,
  POST_WORKFLOW_CREATE_MODE,
  POST_WORKFLOW_EDIT_MODE,
  POST_CREDENTIALS_TYPE,
} from 'common/constants';
import {
  postCreateItem,
  updateMoveItem,
  postInviteItem,
  updateItem,
  removeItem,
} from 'common/api';
import DecryptWorker from 'common/decrypt.worker';
import { prepareAttachments, prepareFiles, initialPostData } from './utils';

const { Sider } = Layout;

const Wrapper = styled(Layout)`
  height: 100vh;
  flex: initial;
`;

const SidebarWrapper = styled(Sider)`
  background: #fff;
  height: 100vh;
`;

const MiddleColumnWrapper = styled(Layout)`
  display: flex;
  flex: initial;
  width: 400px;
  min-width: 400px;
  background: #f5f6fa;
  border-left: 1px solid #eaeaea;
  border-right: 1px solid #eaeaea;
`;

const RightColumnWrapper = styled(Layout)`
  background: #fff;
  flex-direction: column;
`;

// TODO: add helper method for update and replace node after any changing
// TODO: add helper method for construct workInProgressPost from parts

function getListWithoutChildren(list) {
  const { children, ...rest } = list;

  return { ...rest, children: [] };
}

class DashboardContainer extends Component {
  state = this.prepareInitialState();

  normalize = memoize(list =>
    list.reduce((acc, item) => ({ ...acc, [item.id]: item }), {}),
  );

  componentDidMount() {
    this.worker = new DecryptWorker();

    this.worker.addEventListener('message', this.handleWorkerMessage);

    this.worker.postMessage({
      event: 'toDecryptList',
      data: {
        list: this.props.list,
        privateKey: this.props.privateKey,
        password: this.props.password,
      },
    });
  }

  componentWillUnmount() {
    this.worker.removeEventListener('message', this.handleWorkerMessage);
  }

  handleWorkerMessage = msg => {
    const { list } = this.state;

    const {
      data: { event, data },
    } = msg;

    switch (event) {
      case 'fromDecryptList': {
        this.setState({
          list: addNode(list, data.node.model.listId, data.node.model),
        });

        break;
      }

      default:
        break;
    }
  };

  handleClickSection = ({ key }) => {
    this.setState({
      selectedListId: key,
      workInProgressPost: null,
    });
  };

  handleClickPost = postId => () => {
    const { list } = this.state;

    const post = findNode(list, postId).model;

    this.setState(prevState => ({
      ...prevState,
      workInProgressPost: {
        mode: POST_REVIEW_MODE,
        ...post,
      },
    }));
  };

  handleClickCreatePost = () => {
    this.setState(prevState => ({
      ...prevState,
      workInProgressPost: {
        ...initialPostData(POST_CREDENTIALS_TYPE, prevState.selectedListId),
        mode: POST_WORKFLOW_CREATE_MODE,
      },
    }));
  };

  handleClickEditPost = () => {
    const {
      list,
      workInProgressPost: { id: postId },
    } = this.state;

    const post = findNode(list, postId).model;

    this.setState(prevState => ({
      ...prevState,
      workInProgressPost: {
        ...post,
        secret: {
          ...post.secret,
          attachments: prepareFiles(post.secret.attachments),
        },
        mode: POST_WORKFLOW_EDIT_MODE,
      },
    }));
  };

  handleClickMoveToTrash = () => {
    Modal.confirm({
      centered: true,
      title: 'Warning',
      content: 'Are you sure you want to move the post to trash?',
      okText: 'Remove',
      cancelText: 'Cancel',
      onOk: this.handleMoveToTrash,
      okButtonProps: { type: 'danger', size: 'large' },
      cancelButtonProps: { size: 'large' },
    });
  };

  handleClickRemovePost = () => {
    Modal.confirm({
      centered: true,
      title: 'Warning',
      content: 'Are you sure you want to delete the post?',
      okText: 'Remove',
      cancelText: 'Cancel',
      onOk: this.handleRemovePost,
      okButtonProps: { type: 'danger', size: 'large' },
      cancelButtonProps: { size: 'large' },
    });
  };

  handleRemovePost = async () => {
    const { workInProgressPost, selectedListId, list } = this.state;

    const newList = removeNode(list, workInProgressPost.id);
    const nextWorkInProgressNode = findNode(newList, selectedListId).model;
    const nextWorkInProgress =
      nextWorkInProgressNode.children.length > 0
        ? nextWorkInProgressNode.children[0]
        : null;

    try {
      await removeItem(workInProgressPost.id);

      this.setState(prevState => ({
        ...prevState,
        workInProgressPost: {
          ...nextWorkInProgress,
          mode: POST_REVIEW_MODE,
        },
        list: newList,
      }));
    } catch (e) {
      console.log(e);
    }
  };

  handleMoveToTrash = async () => {
    const { list, selectedListId, workInProgressPost } = this.state;

    const { mode, ...rest } = workInProgressPost;
    const {
      id: postId,
      secret: { name, attachments },
    } = rest;

    try {
      const preparedAttachments = await prepareAttachments(attachments);
      const trashNodeId = list.model.children[2].id;
      const data = {
        ...rest,
        listId: trashNodeId,
        secret: {
          ...rest.secret,
          attachments: preparedAttachments,
        },
      };

      await updateMoveItem(postId, { listId: trashNodeId });
      message.success(`The post «${name}» was moved to trash.`);

      const newList = replaceNode(
        updateNode(list, postId, data),
        postId,
        trashNodeId,
      );
      const nextWorkInProgressNode = findNode(newList, selectedListId).model;
      const nextWorkInProgress =
        nextWorkInProgressNode.children.length > 0
          ? nextWorkInProgressNode.children[0]
          : null;

      this.setState(prevState => ({
        ...prevState,
        workInProgressPost: {
          ...nextWorkInProgress,
          mode: POST_REVIEW_MODE,
        },
        list: newList,
      }));
    } catch (e) {
      console.log(e);
    }
  };

  handleFinishCreateWorkflow = async ({ listId, attachments, ...secret }) => {
    const { publicKey } = this.props;

    try {
      const preparedAttachments = await prepareAttachments(attachments);
      const item = {
        ...secret,
        attachments: preparedAttachments,
      };

      const options = {
        message: openpgp.message.fromText(JSON.stringify(item)),
        publicKeys: (await openpgp.key.readArmored(publicKey)).keys,
      };

      const encrypted = await openpgp.encrypt(options);
      const encryptedItem = encrypted.data;

      const data = {
        listId,
        type: POST_CREDENTIALS_TYPE,
        secret: encryptedItem,
      };

      const {
        data: { id: postId, lastUpdated },
      } = await postCreateItem(data);

      const newPost = {
        id: postId,
        listId,
        lastUpdated,
        favorite: false,
        shared: [],
        tags: [],
        owner: true,
        secret: item,
        type: POST_CREDENTIALS_TYPE,
      };

      this.setState(prevState => ({
        ...prevState,
        workInProgressPost: {
          ...newPost,
          mode: POST_REVIEW_MODE,
        },
        list: addNode(prevState.list, listId, newPost),
      }));
    } catch (e) {
      console.log(e);
    }
  };

  handleFinishEditWorkflow = async ({ listId, attachments, ...secret }) => {
    const { publicKey, members } = this.props;
    const { workInProgressPost } = this.state;

    try {
      const preparedAttachments = await prepareAttachments(attachments);

      const data = {
        ...secret,
        attachments: preparedAttachments,
      };

      const isSecretChanged = !deepequal(workInProgressPost.secret, data);
      const isListIdChanged = listId !== workInProgressPost.listId;

      if (!isSecretChanged && !isListIdChanged) {
        return this.setState(prevState => ({
          ...prevState,
          workInProgressPost: {
            ...prevState.workInProgressPost,
            secret: data,
            mode: POST_REVIEW_MODE,
          },
        }));
      }

      const promises = [];

      if (isSecretChanged) {
        const options = {
          message: openpgp.message.fromText(JSON.stringify(data)),
          publicKeys: (await openpgp.key.readArmored(publicKey)).keys,
        };

        const encrypted = await openpgp.encrypt(options);
        const encryptedItem = encrypted.data;

        promises.push(
          updateItem(workInProgressPost.id, { secret: encryptedItem }),
        );

        const invitedMembers = members.filter(({ id }) =>
          workInProgressPost.shared.includes(id),
        );

        const invitePromises = invitedMembers.map(async member => {
          const opts = {
            message: openpgp.message.fromText(JSON.stringify(data)),
            publicKeys: (await openpgp.key.readArmored(member.publicKey)).keys,
          };

          return openpgp.encrypt(opts);
        });

        const encryptedData = await Promise.all(invitePromises);

        const invites = encryptedData.map((encrypt, index) => ({
          userId: invitedMembers[index].id,
          secret: encrypt.data,
        }));

        await postInviteItem(workInProgressPost.id, {
          invites,
        });
      }

      if (isListIdChanged) {
        promises.push(updateMoveItem(workInProgressPost.id, { listId }));
      }

      const [
        {
          data: { lastUpdated },
        },
      ] = await Promise.all(promises);

      this.setState(prevState => ({
        ...prevState,
        selectedListId: listId,
        workInProgressPost: {
          ...prevState.workInProgressPost,
          listId,
          lastUpdated,
          mode: POST_REVIEW_MODE,
          secret: data,
        },
        list: replaceNode(
          updateNode(prevState.list, workInProgressPost.id, {
            listId,
            lastUpdated,
            secret: data,
          }),
          workInProgressPost.id,
          listId,
        ),
      }));
    } catch (e) {
      console.log(e);
    }
  };

  handleClickCancelWorkflow = () => {
    this.setState(prevState => ({
      ...prevState,
      workInProgressPost:
        prevState.workInProgressPost.mode === POST_WORKFLOW_EDIT_MODE
          ? { ...prevState.workInProgressPost, mode: POST_REVIEW_MODE }
          : null,
    }));
  };

  handleClickRestorePost = async () => {
    const { list, workInProgressPost } = this.state;

    const inboxNodeId = list.model.children[0].id;

    await updateMoveItem(workInProgressPost.id, { listId: inboxNodeId });

    this.setState(prevState => ({
      ...prevState,
      selectedListId: inboxNodeId,
      workInProgressPost: {
        ...prevState.workInProgressPost,
        mode: POST_REVIEW_MODE,
        listId: inboxNodeId,
      },
      list: replaceNode(
        updateNode(prevState.list, workInProgressPost.id, {
          secret: workInProgressPost.secret,
          listId: inboxNodeId,
        }),
        workInProgressPost.id,
        inboxNodeId,
      ),
    }));
  };

  handleClickShare = () => {
    this.setState({
      isVisibleInviteModal: true,
    });
  };

  handleInviteMembers = async memberIds => {
    const { members } = this.props;
    const { workInProgressPost } = this.state;

    const invitedMembers = members.filter(({ id }) => memberIds.includes(id));

    const promises = invitedMembers.map(async member => {
      const options = {
        message: openpgp.message.fromText(
          JSON.stringify(workInProgressPost.secret),
        ),
        publicKeys: (await openpgp.key.readArmored(member.publicKey)).keys,
      };

      return openpgp.encrypt(options);
    });

    const encrypted = await Promise.all(promises);

    const invites = encrypted.map((encrypt, index) => ({
      userId: invitedMembers[index].id,
      secret: encrypt.data,
    }));

    try {
      await postInviteItem(workInProgressPost.id, {
        invites,
      });

      const data = {
        ...workInProgressPost,
        shared: memberIds,
      };

      this.setState(prevState => ({
        ...prevState,
        isVisibleInviteModal: false,
        workInProgressPost: data,
        list: updateNode(prevState.list, workInProgressPost.id, data),
      }));
    } catch (e) {
      console.log(e);
    }
  };

  handleCloseModal = () => {
    this.setState({
      isVisibleInviteModal: false,
    });
  };

  prepareInitialState() {
    const { list, predefinedListId } = this.props;

    let selectedListId = null;

    if (predefinedListId) {
      selectedListId = predefinedListId;
    } else if (list && list.length > 0) {
      selectedListId = list[0].id;
    }

    const root = {
      type: ROOT_TYPE,
      children: [
        getListWithoutChildren(list[0]),
        { ...list[1], children: list[1].children.map(getListWithoutChildren) },
        getListWithoutChildren(list[2]),
      ],
    };

    const tree = createTree(root);

    return {
      isVisibleInviteModal: false,
      list: tree,
      selectedListId,
      workInProgressPost: null,
    };
  }

  prepareAllList() {
    const {
      list: {
        model: { children },
      },
    } = this.state;

    if (!children || !children.length) {
      return [];
    }

    return [
      { id: children[0].id, label: 'Inbox', type: INBOX_TYPE },
      ...children[1].children.map(({ id, label }) => ({
        id,
        label,
        type: LIST_TYPE,
      })),
      { id: children[2].id, label: 'Trash', type: TRASH_TYPE },
    ];
  }

  render() {
    const { user, members } = this.props;
    const {
      list,
      selectedListId,
      workInProgressPost,
      isVisibleInviteModal,
    } = this.state;

    if (
      !list ||
      !list.model ||
      !list.model.children ||
      !list.model.children.length
    ) {
      return null;
    }

    const {
      model: { children },
    } = list;

    const allLists = this.prepareAllList();
    const selectedList = findNode(list, selectedListId).model;
    const trashList = findNode(list, node => node.model.type === TRASH_TYPE)
      .model;

    const shouldShowPost = !!workInProgressPost;
    const activePostId = workInProgressPost ? workInProgressPost.id : null;
    const isTrashPost =
      workInProgressPost && workInProgressPost.listId === trashList.id;

    return (
      <Fragment>
        <Wrapper>
          <SidebarWrapper width={240}>
            <Sidebar
              selectedKeys={selectedListId}
              sections={children}
              onClickSection={this.handleClickSection}
            />
          </SidebarWrapper>
          <MiddleColumnWrapper>
            <PostList
              title={selectedList.label}
              activePostId={activePostId}
              list={selectedList.children}
              members={this.normalize(members)}
              onClickPost={this.handleClickPost}
              onClickCreatePost={this.handleClickCreatePost}
            />
          </MiddleColumnWrapper>
          <RightColumnWrapper>
            <Header withBorder user={user} />
            {shouldShowPost && (
              <Post
                isTrashPost={isTrashPost}
                post={workInProgressPost}
                allLists={allLists}
                members={this.normalize(members)}
                onClickShare={this.handleClickShare}
                onClickEditPost={this.handleClickEditPost}
                onClickMoveToTrash={this.handleClickMoveToTrash}
                onFinishCreateWorkflow={this.handleFinishCreateWorkflow}
                onFinishEditWorkflow={this.handleFinishEditWorkflow}
                onCancelWorkflow={this.handleClickCancelWorkflow}
                onClickRestorePost={this.handleClickRestorePost}
                onClickRemovePost={this.handleClickRemovePost}
              />
            )}
          </RightColumnWrapper>
        </Wrapper>
        {isVisibleInviteModal && (
          <InviteModal
            members={members}
            shared={workInProgressPost.shared}
            onClickInvite={this.handleInviteMembers}
            onCancel={this.handleCloseModal}
          />
        )}
      </Fragment>
    );
  }
}

export default DashboardContainer;
