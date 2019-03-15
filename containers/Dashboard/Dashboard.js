import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import deepequal from 'fast-deep-equal';
import memoize from 'memoize-one';
import * as openpgp from 'openpgp';
import {
  Item,
  List,
  InviteModal,
  ShareModal,
  ConfirmModal,
  MenuList,
  withNotification,
  DashboardLayout,
} from 'components';
import {
  createTree,
  findNode,
  replaceNode,
  addNode,
  updateNode,
  removeNode,
} from 'common/utils/tree';
import { createSrp } from 'common/utils/srp';
import { generateSharingUrl, generateInviteUrl } from 'common/utils/sharing';
import {
  encryptItem,
  encryptItemForUsers,
  generateUser,
  generateAnonymousEmail,
  objectToBase64,
} from 'common/utils/cipherUtils';
import {
  ROOT_TYPE,
  INBOX_TYPE,
  LIST_TYPE,
  TRASH_TYPE,
  FAVORITES_TYPE,
  ITEM_REVIEW_MODE,
  ITEM_WORKFLOW_CREATE_MODE,
  ITEM_WORKFLOW_EDIT_MODE,
  PERMISSION_READ,
  INVITE_TYPE,
  SHARE_TYPE,
  USER_ROLE,
  READ_ONLY_USER_ROLE,
  ANONYMOUS_USER_ROLE,
  SHARED_WAITING_STATUS,
  PERMISSION_WRITE,
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
  getPublicKeyByEmail,
  postNewUser,
  postShare,
  postShares,
  updateShares,
  deleteShare,
  updateShare,
  getList,
  getUserSelf,
  getUsers,
  postInvitation,
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

const srp = createSrp();

// TODO: add helper method for update and replace node after any changing
// TODO: add helper method for construct workInProgressPost from parts
const getListWithoutChildren = list => ({ ...list, children: [] });

class DashboardContainer extends Component {
  state = this.prepareInitialState();

  normalize = memoize(list =>
    list.reduce((acc, item) => ({ ...acc, [item.id]: item }), {}),
  );

  async componentDidMount() {
    this.worker = new DecryptWorker();

    const { data: list } = await getList();
    const { data: user } = await getUserSelf();
    const { data: members } = await getUsers();

    this.worker.addEventListener('message', this.handleWorkerMessage);

    this.worker.postMessage({
      event: 'toDecryptList',
      data: {
        list,
        privateKey: this.props.privateKey,
        password: this.props.password,
      },
    });

    const root = {
      type: ROOT_TYPE,
      children: [
        getListWithoutChildren(list[0]),
        { ...list[1], children: list[1].children.map(getListWithoutChildren) },
        getListWithoutChildren(list[2]),
      ],
    };

    this.setState({
      user,
      members,
      list: createTree(root),
      selectedListId: list[0].id,
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
    const { workInProgressItem, list } = this.state;

    const newList = removeNode(list, workInProgressItem.id);

    try {
      await removeItem(workInProgressItem.id);

      this.setState(prevState => ({
        ...prevState,
        isVisibleRemoveModal: false,
        workInProgressItem: null,
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
        icon: 'ok',
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
    const { publicKey } = this.props;
    const { user } = this.state;

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
        shared: [],
        tags: [],
        owner: user,
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

  handleFinishEditWorkflow = async ({
    listId,
    attachments,
    type,
    ...secret
  }) => {
    const { publicKey } = this.props;
    const { workInProgressItem, members, user } = this.state;

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

        const { invited, shared } = workInProgressItem;

        if (!invited.length) {
          promises.push(
            updateItem(workInProgressItem.id, { secret: encryptedItem }),
          );
        } else {
          const invitedMembersIds = invited.map(({ userId }) => userId);
          const invitedMemberKeys = members
            .filter(({ id }) => invitedMembersIds.includes(id))
            .map(member => member.publicKey);

          const invitedEncryptedSecrets = await encryptItemForUsers(
            data,
            invitedMemberKeys,
          );

          const invites = invitedEncryptedSecrets.map((encrypt, index) => ({
            userId: invitedMembersIds[index],
            secret: encrypt,
          }));

          if (invites.length) {
            promises.push(
              changeInviteItem(workInProgressItem.id, {
                invites: [
                  ...invites,
                  { userId: user.id, secret: encryptedItem },
                ],
              }),
            );
          }
        }

        if (shared.length) {
          const sharedUserKeys = shared.map(member => member.publicKey);

          const sharedEncryptedSecrets = await encryptItemForUsers(
            data,
            sharedUserKeys,
          );

          const shares = sharedEncryptedSecrets.map((encrypt, idx) => ({
            id: shared[idx].id,
            sharedItems: [{ item: workInProgressItem.id, secret: encrypt }],
            link: shared[idx].link,
          }));

          promises.push(
            updateShares({
              shares,
            }),
          );
        }
      }

      if (isListIdChanged) {
        promises.push(updateMoveItem(workInProgressItem.id, { listId }));
      }

      await Promise.all(promises);

      this.setState(prevState => ({
        ...prevState,
        selectedListId: listId,
        workInProgressItem: {
          ...prevState.workInProgressItem,
          listId,
          mode: ITEM_REVIEW_MODE,
          secret: data,
        },
        list: replaceNode(
          updateNode(prevState.list, workInProgressItem.id, {
            listId,
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
    console.log(invitedUserIds, invitedByUserId);
    const { workInProgressItem, members } = this.state;
    const { invited } = workInProgressItem;
    const newInvitedMembers = members.filter(({ id }) =>
      invitedUserIds.includes(id),
    );
    const newMembers = Object.values(invitedByUserId)
      .filter(({ isNew }) => !!isNew)
      .map(({ userId, isNew, email, ...rest }) => ({
        id: userId,
        name: email,
        email,
        ...rest,
      }));

    const allMembers = [...newInvitedMembers, ...newMembers];

    const encryptedPromises = allMembers.map(async member => {
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
      userId: allMembers[index].id,
      secret: encrypt.data,
      access: invitedByUserId[allMembers[index].id].access,
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

      if (newMembers.length > 0) {
        await Promise.all(
          newMembers.map(async ({ email, password, masterPassword }) => {
            await postInvitation({
              email,
              url: generateInviteUrl(
                objectToBase64({
                  e: email,
                  p: password,
                  mp: masterPassword,
                }),
              ),
            });
          }),
        );
      }

      this.setState(prevState => ({
        ...prevState,
        isVisibleInviteModal: false,
        workInProgressItem: data,
        list: updateNode(prevState.list, workInProgressItem.id, data),
        members: [...prevState.members, ...newMembers],
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

  handleInviteMembers = async (invited, newInvites) => {
    const { workInProgressItem } = this.state;
    const { invited: currentlyInvited } = workInProgressItem;

    let newInvited = [];

    if (newInvites && newInvites.length > 0) {
      newInvited = await Promise.all(
        newInvites.map(email => this.createUser(email, USER_ROLE)),
      );
    }

    const currentlyInvitedByUserId = currentlyInvited.reduce((acc, invite) => {
      acc[invite.userId] = invite;
      return acc;
    }, {});

    const invitedByUserId = invited.reduce((acc, invite) => {
      acc[invite.userId] = invite;
      return acc;
    }, {});

    const newInvitedByUserId = newInvited.reduce((acc, invite) => {
      acc[invite.userId] = { ...invite, access: PERMISSION_WRITE, isNew: true };
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
        newInvites: newInvited.map(({ userId }) => userId),
        accessChange: [],
      },
    );

    invitedUserIds.removeInvites = Object.keys(currentlyInvitedByUserId)
      .filter(userId => !Object.keys(invitedByUserId).includes(userId))
      .map(userId => currentlyInvitedByUserId[userId].id);

    if (invitedUserIds.newInvites.length) {
      await this.inviteNewMembers(invitedUserIds.newInvites, {
        ...invitedByUserId,
        ...newInvitedByUserId,
      });
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

  handleActivateShareByLink = async () => {
    const { workInProgressItem } = this.state;

    const email = generateAnonymousEmail();

    try {
      const {
        userId,
        password,
        masterPassword,
        publicKey,
      } = await this.createUser(email, ANONYMOUS_USER_ROLE);

      const encryptedSecret = await encryptItem(
        workInProgressItem.secret,
        publicKey,
      );

      const {
        data: { id: shareId },
      } = await postShare({
        user: userId,
        sharedItems: [{ item: workInProgressItem.id, secret: encryptedSecret }],
      });

      const link = generateSharingUrl(
        shareId,
        objectToBase64({
          e: email,
          p: password,
          mp: masterPassword,
        }),
      );

      await updateShare(shareId, {
        link,
      });

      const shared = {
        id: shareId,
        userId,
        email,
        link,
        status: SHARED_WAITING_STATUS,
        roles: [ANONYMOUS_USER_ROLE],
      };

      const data = {
        ...workInProgressItem,
        shared: [...workInProgressItem.shared, shared],
      };

      this.setState(prevState => ({
        ...prevState,
        workInProgressItem: data,
        list: updateNode(prevState.list, workInProgressItem.id, data),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  handleDeactivateShareByLink = async () => {
    const {
      workInProgressItem: { shared },
    } = this.state;

    const anonymousShare = shared.find(({ roles }) =>
      roles.includes(ANONYMOUS_USER_ROLE),
    );

    const updatedShared = shared.filter(({ id }) => id !== anonymousShare.id);

    try {
      await deleteShare(anonymousShare.id);

      this.setState(prevState => ({
        ...prevState,
        workInProgressItem: {
          ...prevState.workInProgressItem,
          shared: updatedShared,
        },
        list: updateNode(prevState.list, prevState.workInProgressItem.id, {
          shared: updatedShared,
        }),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  createUser = async (email, role) => {
    try {
      const {
        password,
        masterPassword,
        publicKey,
        privateKey,
      } = await generateUser(email);

      const seed = srp.getRandomSeed();
      const verifier = srp.generateV(srp.generateX(seed, email, password));

      const data = {
        email,
        plainPassword: password,
        publicKey,
        encryptedPrivateKey: privateKey,
        seed,
        verifier,
        roles: [role],
      };

      const {
        data: { user: userId },
      } = await postNewUser(data);

      return {
        userId,
        password,
        masterPassword,
        publicKey,
        privateKey,
        email,
      };
    } catch (e) {
      console.log(e || e.response);
      return null;
    }
  };

  userResolver = async email => {
    try {
      const {
        data: { userId, publicKey },
      } = await getPublicKeyByEmail(email);

      return { userId, publicKey, type: INVITE_TYPE };
    } catch (e) {
      const {
        userId,
        password,
        masterPassword,
        publicKey,
      } = await this.createUser(email, READ_ONLY_USER_ROLE);

      return {
        userId,
        email,
        password,
        masterPassword,
        publicKey,
        type: SHARE_TYPE,
      };
    }
  };

  handleShare = async emails => {
    if (!emails.length) {
      return this.setState({
        isVisibleShareModal: false,
      });
    }

    const { workInProgressItem } = this.state;

    const promises = await emails.map(this.userResolver);
    const response = await Promise.all(promises);

    const itemInvitedUsers = workInProgressItem.invited.map(
      ({ userId }) => userId,
    );

    const users = response.filter(
      user => !!user && !itemInvitedUsers.includes(user.userId),
    );
    const invitedUsers = users.filter(({ type }) => type === INVITE_TYPE);
    const sharedUsers = users.filter(({ type }) => type === SHARE_TYPE);

    const invitedUserKeys = invitedUsers.map(({ publicKey }) => publicKey);
    const sharedUserKeys = sharedUsers.map(({ publicKey }) => publicKey);

    const invitedEncryptedSecrets = await encryptItemForUsers(
      workInProgressItem.secret,
      invitedUserKeys,
    );

    const sharedEncryptedSecrets = await encryptItemForUsers(
      workInProgressItem.secret,
      sharedUserKeys,
    );

    const invites = invitedEncryptedSecrets.map((secret, idx) => ({
      secret,
      userId: invitedUsers[idx].userId,
      access: PERMISSION_READ,
    }));

    const shares = sharedEncryptedSecrets.map((secret, idx) => ({
      user: sharedUsers[idx].userId,
      sharedItems: [{ item: workInProgressItem.id, secret }],
    }));

    let invited = [];
    let shared = [];

    if (invites.length) {
      const { data } = await postInviteItem(workInProgressItem.id, { invites });

      invited = data;
    }

    if (shares.length) {
      const { data: newShares } = await postShares({ shares });

      const updatedShares = sharedEncryptedSecrets.map((secret, idx) => {
        const { email, password, masterPassword } = sharedUsers[idx];
        const { id: shareId } = newShares[idx];

        return {
          id: shareId,
          link: generateSharingUrl(
            shareId,
            objectToBase64({
              e: email,
              p: password,
              mp: masterPassword,
            }),
          ),
        };
      });

      const { data: updatedShared } = await updateShares({
        shares: updatedShares,
      });

      shared = updatedShared.map(({ id, updatedAt, createdAt }, idx) => {
        const { link } = updatedShares[idx];
        const { userId, email } = sharedUsers[idx];
        const status = SHARED_WAITING_STATUS;

        return {
          id,
          userId,
          email,
          link,
          status,
          updatedAt,
          createdAt,
          roles: [READ_ONLY_USER_ROLE],
        };
      });
    }

    const data = {
      ...workInProgressItem,
      invited: [...workInProgressItem.invited, ...invited],
      shared: [...workInProgressItem.shared, ...shared],
    };

    return this.setState(prevState => ({
      ...prevState,
      workInProgressItem: data,
      isVisibleShareModal: false,
      list: updateNode(prevState.list, workInProgressItem.id, data),
    }));
  };

  handleRemoveShare = id => async () => {
    const { workInProgressItem } = this.state;

    try {
      await deleteShare(id);

      const updatedShares = workInProgressItem.shared.filter(
        ({ id: shareId }) => shareId !== id,
      );

      const data = {
        ...workInProgressItem,
        shared: updatedShares,
      };

      this.setState(prevState => ({
        ...prevState,
        workInProgressItem: data,
        list: updateNode(prevState.list, workInProgressItem.id, data),
      }));
    } catch (e) {
      console.log(e.response);
    }
  };

  handleResendShare = shareId => async () => {
    const { workInProgressItem } = this.state;

    const share = workInProgressItem.shared.find(({ id }) => id === shareId);

    const { data } = await updateShare(shareId, { link: share.link });

    const shared = workInProgressItem.shared.map(
      shareItem =>
        shareItem.id === shareId
          ? { ...shareItem, updatedAt: data.updatedAt }
          : shareItem,
    );

    const updatedData = {
      ...workInProgressItem,
      shared,
    };

    this.setState(prevState => ({
      ...prevState,
      workInProgressItem: updatedData,
      list: updateNode(prevState.list, workInProgressItem.id, updatedData),
    }));
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
    return {
      isVisibleInviteModal: false,
      isVisibleShareModal: false,
      isVisibleMoveToTrashModal: false,
      isVisibleRemoveModal: false,
      list: null,
      favorites: {
        id: FAVORITES_TYPE,
        label: FAVORITES_TYPE,
        type: FAVORITES_TYPE,
        children: [],
      },
      selectedListId: null,
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
    const { notification } = this.props;
    const {
      user,
      members,
      list,
      favorites,
      selectedListId,
      workInProgressItem,
      isVisibleInviteModal,
      isVisibleShareModal,
      isVisibleMoveToTrashModal,
      isVisibleRemoveModal,
    } = this.state;

    if (!list) {
      return null;
    }

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
        <DashboardLayout user={user} withSearch>
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
                notification={notification}
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
        </DashboardLayout>
        {isVisibleInviteModal && (
          <InviteModal
            members={members}
            invited={workInProgressItem.invited}
            onClickInvite={this.handleInviteMembers}
            onCancel={this.handleCloseInviteModal}
          />
        )}
        {isVisibleShareModal && (
          <ShareModal
            shared={workInProgressItem.shared}
            onResend={this.handleResendShare}
            onShare={this.handleShare}
            onRemove={this.handleRemoveShare}
            onActivateSharedByLink={this.handleActivateShareByLink}
            onDeactivateSharedByLink={this.handleDeactivateShareByLink}
            onCancel={this.handleCloseShareModal}
            notification={notification}
          />
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
