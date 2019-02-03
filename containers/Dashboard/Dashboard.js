import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import deepequal from 'fast-deep-equal';
import memoize from 'memoize-one';
import * as openpgp from 'openpgp';
import {
  Layout,
  Item,
  List,
  InviteModal,
  ShareModal,
  ConfirmModal,
  MenuList,
  withNotification,
} from 'components';
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
  FAVORITES_TYPE,
  ITEM_REVIEW_MODE,
  ITEM_WORKFLOW_CREATE_MODE,
  ITEM_WORKFLOW_EDIT_MODE,
} from 'common/constants';
import {
  postCreateItem,
  updateMoveItem,
  postInviteItem,
  updateItem,
  removeItem,
  toggleFavorite,
  changeInviteAccess,
  deleteInviteItem,
  changeInviteItem,
  acceptUpdateItem,
} from 'common/api';
import DecryptWorker from 'common/decrypt.worker';
import { initialItemData } from './utils';

const MiddleColumnWrapper = styled.div`
  width: 400px;
  flex-shrink: 0;
  background: ${({ theme }) => theme.lightBlue};
  border-right: 1px solid ${({ theme }) => theme.gallery};
`;

const RightColumnWrapper = styled.div`
  position: relative;
  flex-grow: 1;
`;

const CenterWrapper = styled.div`
  display: flex;
  width: 100%;
`;

const Sidebar = styled.aside`
  width: 300px;
  flex-shrink: 0;
  border-right: 1px solid ${({ theme }) => theme.gallery};
`;

// TODO: add helper method for update and replace node after any changing
// TODO: add helper method for construct workInProgressPost from parts

const getListWithoutChildren = list => ({ ...list, children: [] });

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
        this.setState(prevState => {
          const newNode = data.node.model;
          const favorites = [...prevState.favorites.children];

          if (newNode.favorite) {
            favorites.push(newNode);
          }

          return {
            list: addNode(list, newNode.listId, newNode),
            favorites: {
              ...prevState.favorites,
              children: favorites,
            },
          };
        });

        break;
      }

      default:
        break;
    }
  };

  handleClickMenuItem = id => () => {
    this.setState({
      selectedListId: id,
      workInProgressItem: null,
    });
  };

  handleClickItem = itemId => () => {
    const { list } = this.state;

    const item = findNode(list, itemId).model;

    this.setState(prevState => ({
      ...prevState,
      workInProgressItem: {
        mode: ITEM_REVIEW_MODE,
        ...item,
      },
    }));
  };

  handleClickCreateItem = (name, value) => {
    this.setState(prevState => ({
      ...prevState,
      workInProgressItem: {
        ...initialItemData(value, prevState.selectedListId),
        mode: ITEM_WORKFLOW_CREATE_MODE,
      },
    }));
  };

  handleClickEditItem = () => {
    const {
      list,
      workInProgressItem: { id: itemId },
    } = this.state;

    const item = findNode(list, itemId).model;

    this.setState(prevState => ({
      ...prevState,
      workInProgressItem: {
        ...item,
        mode: ITEM_WORKFLOW_EDIT_MODE,
      },
    }));
  };

  handleClickMoveToTrash = () => {
    this.setState({
      isVisibleMoveToTrashModal: true,
    });
  };

  handleClickRemoveItem = () => {
    this.setState({
      isVisibleRemoveModal: true,
    });
  };

  handleRemoveItem = async () => {
    const { workInProgressItem, selectedListId, list } = this.state;

    const newList = removeNode(list, workInProgressItem.id);
    const nextWorkInProgressNode = findNode(newList, selectedListId).model;
    const nextWorkInProgress =
      nextWorkInProgressNode.children.length > 0
        ? nextWorkInProgressNode.children[0]
        : null;

    try {
      await removeItem(workInProgressItem.id);

      this.setState(prevState => ({
        ...prevState,
        isVisibleRemoveModal: false,
        workInProgressItem: {
          ...nextWorkInProgress,
          mode: ITEM_REVIEW_MODE,
        },
        list: newList,
      }));
    } catch (e) {
      console.log(e);
    }
  };

  handleMoveToTrash = async () => {
    const { notification } = this.props;
    const { list, workInProgressItem } = this.state;

    const { mode, ...rest } = workInProgressItem;
    const {
      id: itemId,
      secret: { name, attachments },
    } = rest;

    try {
      const trashNodeId = list.model.children[2].id;
      const data = {
        ...rest,
        listId: trashNodeId,
        secret: {
          ...rest.secret,
          attachments,
        },
      };

      await updateMoveItem(itemId, { listId: trashNodeId });

      notification.show({
        text: `The post «${name}» was moved to trash.`,
      });

      const newList = replaceNode(
        updateNode(list, itemId, data),
        itemId,
        trashNodeId,
      );

      this.setState(prevState => ({
        ...prevState,
        isVisibleMoveToTrashModal: false,
        workInProgressItem: null,
        list: newList,
      }));
    } catch (e) {
      console.log(e);
    }
  };

  handleFinishCreateWorkflow = async ({
    listId,
    attachments,
    type,
    ...secret
  }) => {
    const { publicKey, user } = this.props;

    try {
      const item = {
        ...secret,
        attachments,
      };

      const options = {
        message: openpgp.message.fromText(JSON.stringify(item)),
        publicKeys: (await openpgp.key.readArmored(publicKey)).keys,
      };

      const encrypted = await openpgp.encrypt(options);
      const encryptedItem = encrypted.data;

      const data = {
        listId,
        type,
        secret: encryptedItem,
      };

      const {
        data: { id: itemId, lastUpdated },
      } = await postCreateItem(data);

      const newItem = {
        id: itemId,
        listId,
        lastUpdated,
        favorite: false,
        invited: [],
        tags: [],
        ownerId: user.id,
        secret: item,
        type,
      };

      this.setState(prevState => ({
        ...prevState,
        workInProgressItem: {
          ...newItem,
          mode: ITEM_REVIEW_MODE,
        },
        list: addNode(prevState.list, listId, newItem),
      }));
    } catch (e) {
      console.log(e);
    }
  };

  handleFinishEditWorkflow = async ({ listId, attachments, ...secret }) => {
    const { publicKey, members, user } = this.props;
    const { workInProgressItem } = this.state;

    try {
      const data = {
        ...secret,
        attachments,
      };

      const isSecretChanged = !deepequal(workInProgressItem.secret, data);
      const isListIdChanged = listId !== workInProgressItem.listId;

      if (!isSecretChanged && !isListIdChanged) {
        return this.setState(prevState => ({
          ...prevState,
          workInProgressItem: {
            ...prevState.workInProgressItem,
            secret: data,
            mode: ITEM_REVIEW_MODE,
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

        const { invited } = workInProgressItem;

        if (invited.length === 1) {
          promises.push(
            updateItem(workInProgressItem.id, { secret: encryptedItem }),
          );
        } else {
          const invitedMembersIds = workInProgressItem.invited.map(
            invite => invite.userId,
          );
          const invitedMembers = members.filter(({ id }) =>
            invitedMembersIds.includes(id),
          );
          invitedMembers.push({ id: user.id, publicKey });
          const invitePromises = invitedMembers.map(async member => {
            const opts = {
              message: openpgp.message.fromText(JSON.stringify(data)),
              publicKeys: (await openpgp.key.readArmored(member.publicKey))
                .keys,
            };

            return openpgp.encrypt(opts);
          });

          const encryptedData = await Promise.all(invitePromises);

          const invites = encryptedData.map((encrypt, index) => ({
            userId: invitedMembers[index].id,
            secret: encrypt.data,
          }));
          promises.push(
            changeInviteItem(workInProgressItem.id, {
              invites,
            }),
          );
        }
      }

      if (isListIdChanged) {
        promises.push(updateMoveItem(workInProgressItem.id, { listId }));
      }

      const [
        {
          data: { lastUpdated },
        },
      ] = await Promise.all(promises);

      this.setState(prevState => ({
        ...prevState,
        selectedListId: listId,
        workInProgressItem: {
          ...prevState.workInProgressItem,
          listId,
          lastUpdated,
          mode: ITEM_REVIEW_MODE,
          secret: data,
        },
        list: replaceNode(
          updateNode(prevState.list, workInProgressItem.id, {
            listId,
            lastUpdated,
            secret: data,
          }),
          workInProgressItem.id,
          listId,
        ),
      }));
    } catch (e) {
      console.log(e);
    }
  };

  handleToggleFavorites = id => async () => {
    try {
      const { data } = await toggleFavorite(id);

      this.setState(prevState => {
        const newFavorites = { ...prevState.favorites };

        if (data.favorite) {
          newFavorites.children.push({
            ...prevState.workInProgressItem,
            favorite: !prevState.workInProgressItem.favorite,
          });
        } else {
          const itemIndex = newFavorites.children
            .map(item => item.id)
            .indexOf(id);
          newFavorites.children.splice(itemIndex, 1);
        }

        return {
          ...prevState,
          workInProgressItem: {
            ...prevState.workInProgressItem,
            favorite: !prevState.workInProgressItem.favorite,
          },
          list: updateNode(prevState.list, id, {
            ...prevState.workInProgressItem,
            favorite: !prevState.workInProgressItem.favorite,
          }),
          favorites: newFavorites,
        };
      });
    } catch (error) {
      console.error(error);
    }
  };

  handleAcceptUpdate = id => async () => {
    try {
      const { data } = await acceptUpdateItem(id);
      const { secret } = data;
      const { privateKey, password } = this.props;
      const privateKeyObj = (await openpgp.key.readArmored(privateKey)).keys[0];

      await privateKeyObj.decrypt(password);

      const newSecret = await openpgp.message.readArmored(secret);

      const options = {
        message: newSecret,
        privateKeys: [privateKeyObj],
      };

      const { data: decryptedTextItem } = await openpgp.decrypt(options);

      const newItem = { ...data, secret: JSON.parse(decryptedTextItem) };

      this.setState(prevState => ({
        ...prevState,
        workInProgressItem: {
          ...prevState.workInProgressItem,
          ...newItem,
        },
        list: updateNode(
          prevState.list,
          prevState.workInProgressItem.id,
          newItem,
        ),
      }));
    } catch (error) {
      console.error(error);
    }
  };

  handleClickCancelWorkflow = () => {
    this.setState(prevState => ({
      ...prevState,
      workInProgressItem:
        prevState.workInProgressItem.mode === ITEM_WORKFLOW_EDIT_MODE
          ? { ...prevState.workInProgressItem, mode: ITEM_REVIEW_MODE }
          : null,
    }));
  };

  handleClickRestoreItem = async () => {
    const { list, workInProgressItem } = this.state;

    const inboxNodeId = list.model.children[0].id;

    await updateMoveItem(workInProgressItem.id, { listId: inboxNodeId });

    this.setState(prevState => ({
      ...prevState,
      selectedListId: inboxNodeId,
      workInProgressItem: {
        ...prevState.workInProgressItem,
        mode: ITEM_REVIEW_MODE,
        listId: inboxNodeId,
      },
      list: replaceNode(
        updateNode(prevState.list, workInProgressItem.id, {
          secret: workInProgressItem.secret,
          listId: inboxNodeId,
        }),
        workInProgressItem.id,
        inboxNodeId,
      ),
    }));
  };

  handleClickCloseItem = () => {
    this.setState({
      workInProgressItem: null,
    });
  };

  handleCloseConfirmModal = () => {
    this.setState({
      isVisibleMoveToTrashModal: false,
      isVisibleRemoveModal: false,
    });
  };

  handleClickInvite = () => {
    this.setState({
      isVisibleInviteModal: true,
    });
  };

  handleClickShare = () => {
    this.setState({
      isVisibleShareModal: true,
    });
  };

  inviteNewMembers = async (invitedUserIds, invitedByUserId) => {
    const { members } = this.props;
    const { workInProgressItem } = this.state;
    const { invited } = workInProgressItem;
    const newInvitedMembers = members.filter(({ id }) =>
      invitedUserIds.includes(id),
    );

    const encryptedPromises = newInvitedMembers.map(async member => {
      const options = {
        message: openpgp.message.fromText(
          JSON.stringify(workInProgressItem.secret),
        ),
        publicKeys: (await openpgp.key.readArmored(member.publicKey)).keys,
      };

      return openpgp.encrypt(options);
    });

    const encrypted = await Promise.all(encryptedPromises);

    const newInvites = encrypted.map((encrypt, index) => ({
      userId: newInvitedMembers[index].id,
      secret: encrypt.data,
      access: invitedByUserId[newInvitedMembers[index].id].access,
    }));

    try {
      await postInviteItem(workInProgressItem.id, {
        invites: newInvites,
      });

      const data = {
        ...workInProgressItem,
        invited: [
          ...invited,
          ...invitedUserIds.map(userId => invitedByUserId[userId]),
        ],
      };

      this.setState(prevState => ({
        ...prevState,
        isVisibleInviteModal: false,
        workInProgressItem: data,
        list: updateNode(prevState.list, workInProgressItem.id, data),
      }));
    } catch (e) {
      console.log(e);
    }
  };

  changeInviteAccesses = async (invitedUserIds, invitedByUserId) => {
    const { workInProgressItem } = this.state;
    const { invited } = workInProgressItem;
    const promises = invitedUserIds.map(userId => async () => {
      const url = invitedByUserId[userId].id;
      const result = await changeInviteAccess(url, {
        access: invitedByUserId[userId].access,
      })
        .then(() => ({ result: userId }))
        .catch(e => ({ error: e }));
      return result;
    });

    await Promise.all(promises.map(promise => promise())).then(results => {
      const positiveResultsIds = results
        .filter(result => typeof result.result !== 'undefined')
        .map(result => result.result);
      const updatedInvites = positiveResultsIds.reduce(
        (acc, userId) =>
          acc.map(
            invite =>
              invite.userId === userId
                ? { ...invite, access: invitedByUserId[userId].access }
                : invite,
          ),
        invited,
      );
      const data = {
        ...workInProgressItem,
        invited: updatedInvites,
      };

      this.setState(prevState => ({
        ...prevState,
        isVisibleInviteModal: false,
        workInProgressItem: data,
        list: updateNode(prevState.list, workInProgressItem.id, data),
      }));
    });
  };

  removeInvites = async removeInviteIds => {
    const { workInProgressItem } = this.state;
    const { invited } = workInProgressItem;
    const promises = removeInviteIds.map(inviteId => async () => {
      const result = await deleteInviteItem(inviteId)
        .then(() => ({ result: inviteId }))
        .catch(e => ({ error: e }));
      return result;
    });

    await Promise.all(promises.map(promise => promise())).then(results => {
      const positiveResultsIds = results
        .filter(result => typeof result.result !== 'undefined')
        .map(result => result.result);
      const updatedInvites = positiveResultsIds.reduce(
        (acc, inviteId) => acc.filter(invite => invite.id !== inviteId),
        invited,
      );
      const data = {
        ...workInProgressItem,
        invited: updatedInvites,
      };

      this.setState(prevState => ({
        ...prevState,
        isVisibleInviteModal: false,
        workInProgressItem: data,
        list: updateNode(prevState.list, workInProgressItem.id, data),
      }));
    });
  };

  handleInviteMembers = async invited => {
    const { workInProgressItem } = this.state;
    const { invited: currentlyInvited } = workInProgressItem;
    const currentlyInvitedByUserId = currentlyInvited.reduce((acc, invite) => {
      acc[invite.userId] = invite;
      return acc;
    }, {});

    const invitedByUserId = invited.reduce((acc, invite) => {
      acc[invite.userId] = invite;
      return acc;
    }, {});

    const invitedUserIds = invited.reduce(
      (acc, invite) => {
        if (Object.keys(currentlyInvitedByUserId).includes(invite.userId)) {
          if (
            currentlyInvitedByUserId[invite.userId].access !== invite.access
          ) {
            acc.accessChange.push(invite.userId);
          }
        } else {
          acc.newInvites.push(invite.userId);
        }
        return acc;
      },
      {
        newInvites: [],
        accessChange: [],
      },
    );

    invitedUserIds.removeInvites = Object.keys(currentlyInvitedByUserId)
      .filter(userId => !Object.keys(invitedByUserId).includes(userId))
      .map(userId => currentlyInvitedByUserId[userId].id);

    if (invitedUserIds.newInvites.length) {
      await this.inviteNewMembers(invitedUserIds.newInvites, invitedByUserId);
    }

    if (invitedUserIds.accessChange.length) {
      await this.changeInviteAccesses(
        invitedUserIds.accessChange,
        invitedByUserId,
      );
    }

    if (invitedUserIds.removeInvites.length) {
      await this.removeInvites(invitedUserIds.removeInvites);
    }
  };

  handleCloseInviteModal = () => {
    this.setState({
      isVisibleInviteModal: false,
    });
  };

  handleCloseShareModal = () => {
    this.setState({
      isVisibleShareModal: false,
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
      isVisibleShareModal: false,
      isVisibleMoveToTrashModal: false,
      isVisibleRemoveModal: false,
      list: tree,
      favorites: {
        id: FAVORITES_TYPE,
        label: FAVORITES_TYPE,
        type: FAVORITES_TYPE,
        children: [],
      },
      selectedListId,
      workInProgressItem: null,
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
      favorites,
      selectedListId,
      workInProgressItem,
      isVisibleInviteModal,
      isVisibleShareModal,
      isVisibleMoveToTrashModal,
      isVisibleRemoveModal,
    } = this.state;

    const {
      model: { children },
    } = list;

    const renderList = [children[0], children[1], favorites, children[2]];
    const allLists = this.prepareAllList();
    const selectedList =
      selectedListId === FAVORITES_TYPE
        ? favorites
        : findNode(list, selectedListId).model;
    const trashList = findNode(list, node => node.model.type === TRASH_TYPE)
      .model;

    const activeItemId = workInProgressItem ? workInProgressItem.id : null;
    const isTrashItem =
      workInProgressItem && workInProgressItem.listId === trashList.id;

    return (
      <Fragment>
        <Layout user={user} withSearch>
          <CenterWrapper>
            <Sidebar>
              <MenuList
                selectedListId={selectedListId}
                list={renderList}
                onClick={this.handleClickMenuItem}
              />
            </Sidebar>
            <MiddleColumnWrapper>
              <List
                title={selectedList.label}
                activeItemId={activeItemId}
                list={selectedList}
                onClickItem={this.handleClickItem}
                onClickCreateItem={this.handleClickCreateItem}
              />
            </MiddleColumnWrapper>
            <RightColumnWrapper>
              <Item
                isTrashItem={isTrashItem}
                item={workInProgressItem}
                allLists={allLists}
                user={user}
                members={this.normalize(members)}
                onClickCloseItem={this.handleClickCloseItem}
                onClickInvite={this.handleClickInvite}
                onClickShare={this.handleClickShare}
                onClickEditItem={this.handleClickEditItem}
                onClickMoveToTrash={this.handleClickMoveToTrash}
                onFinishCreateWorkflow={this.handleFinishCreateWorkflow}
                onFinishEditWorkflow={this.handleFinishEditWorkflow}
                onCancelWorkflow={this.handleClickCancelWorkflow}
                onClickRestoreItem={this.handleClickRestoreItem}
                onClickRemoveItem={this.handleClickRemoveItem}
                onToggleFavorites={this.handleToggleFavorites}
                onClickAcceptUpdate={this.handleAcceptUpdate}
              />
            </RightColumnWrapper>
          </CenterWrapper>
        </Layout>
        {isVisibleInviteModal && (
          <InviteModal
            members={members}
            invited={workInProgressItem.invited}
            onClickInvite={this.handleInviteMembers}
            onCancel={this.handleCloseInviteModal}
          />
        )}
        {isVisibleShareModal && (
          <ShareModal onCancel={this.handleCloseShareModal} />
        )}
        <ConfirmModal
          isOpen={isVisibleMoveToTrashModal}
          description="Are you sure you want to move the post to trash?"
          onClickOk={this.handleMoveToTrash}
          onClickCancel={this.handleCloseConfirmModal}
        />
        <ConfirmModal
          isOpen={isVisibleRemoveModal}
          description="Are you sure you want to delete the post?"
          onClickOk={this.handleRemoveItem}
          onClickCancel={this.handleCloseConfirmModal}
        />
      </Fragment>
    );
  }
}

export default withNotification(DashboardContainer);
