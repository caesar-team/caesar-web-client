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
  DEFAULT_LIST_TYPE,
  TRASH_TYPE,
  FAVORITES_TYPE,
  ITEM_REVIEW_MODE,
  ITEM_WORKFLOW_CREATE_MODE,
  ITEM_WORKFLOW_EDIT_MODE,
  PERMISSION_READ,
  INVITE_TYPE,
  SHARE_TYPE,
  USER_ROLE,
  ANONYMOUS_USER_ROLE,
  PERMISSION_WRITE,
} from 'common/constants';
import {
  getList,
  postCreateItem,
  updateMoveItem,
  updateItem,
  removeItem,
  toggleFavorite,
  acceptUpdateItem,
  getPublicKeyByEmail,
  postNewUser,
  getUserSelf,
  getUsers,
  postCreateChildItem,
  postInvitation,
  patchChildItemBatch,
  patchChildAccess,
  patchChildItem,
  removeChildItem,
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

    this.props.fetchNodesRequest();

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
    const { list, selectedListId } = this.state;

    const listNode = findNode(list, selectedListId).model;
    const defaultListNode = findNode(
      list,
      node => node.model.label === DEFAULT_LIST_TYPE,
    );

    this.setState(prevState => ({
      ...prevState,
      workInProgressItem: {
        ...initialItemData(
          value,
          listNode.type === INBOX_TYPE
            ? defaultListNode.model.id
            : selectedListId,
        ),
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

  handleFinishCreateWorkflow = async (
    { listId, attachments, type, ...secret },
    { setSubmitting },
  ) => {
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
    } finally {
      setSubmitting(false);
    }
  };

  handleClickMoveItem = async (_, listId) => {
    const { workInProgressItem } = this.state;

    await updateMoveItem(workInProgressItem.id, { listId });

    this.setState(prevState => ({
      ...prevState,
      selectedListId: listId,
      workInProgressItem: {
        ...prevState.workInProgressItem,
        listId,
      },
      list: replaceNode(
        updateNode(prevState.list, workInProgressItem.id, {
          listId,
        }),
        workInProgressItem.id,
        listId,
      ),
    }));
  };

  handleFinishEditWorkflow = async (
    { listId, attachments, type, ...secret },
    { setSubmitting },
  ) => {
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

        const filteredInvited = invited.filter(
          ({ userId }) => userId !== user.id,
        );

        if (!filteredInvited.length) {
          promises.push(
            updateItem(workInProgressItem.id, { secret: encryptedItem }),
          );
        } else {
          const invitedMembersIds = filteredInvited.map(({ userId }) => userId);
          const invitedMemberKeys = members
            .filter(({ id }) => invitedMembersIds.includes(id))
            .map(member => member.publicKey);

          const invitedEncryptedSecrets = await encryptItemForUsers(
            data,
            invitedMemberKeys,
          );

          const invitedChildItems = invitedEncryptedSecrets.map(
            (encrypt, index) => ({
              userId: invitedMembersIds[index],
              secret: encrypt,
            }),
          );

          if (invitedChildItems.length) {
            await patchChildItemBatch({
              collectionItems: [
                {
                  originalItem: workInProgressItem.id,
                  items: [
                    ...invitedChildItems,
                    { userId: user.id, secret: encryptedItem },
                  ],
                },
              ],
            });
          }
        }

        if (shared.length) {
          const sharedMembersIds = shared.map(({ userId }) => userId);
          const sharedUserKeys = shared.map(member => member.publicKey);

          const sharedEncryptedSecrets = await encryptItemForUsers(
            data,
            sharedUserKeys,
          );

          const sharedChildItems = sharedEncryptedSecrets.map(
            (encrypt, idx) => ({
              userId: sharedMembersIds[idx],
              secret: encrypt,
            }),
          );

          if (sharedChildItems.length) {
            await patchChildItemBatch({
              collectionItems: [
                {
                  originalItem: workInProgressItem.id,
                  items: sharedChildItems,
                },
              ],
            });
          }
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
      console.log(e.response);
    } finally {
      setSubmitting(false);
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

  handleInviteMember = async userId => {
    const { workInProgressItem, members } = this.state;
    const user = members.find(({ id }) => id === userId);

    const options = {
      message: openpgp.message.fromText(
        JSON.stringify(workInProgressItem.secret),
      ),
      publicKeys: (await openpgp.key.readArmored(user.publicKey)).keys,
    };

    const encryptedSecret = await openpgp.encrypt(options);

    try {
      const {
        data: { items },
      } = await postCreateChildItem(workInProgressItem.id, {
        items: [
          {
            userId: user.id,
            secret: encryptedSecret.data,
            cause: INVITE_TYPE,
            access: PERMISSION_WRITE,
          },
        ],
      });

      const item = items[0];

      this.setState(prevState => ({
        ...prevState,
        workInProgressItem: {
          ...prevState.workInProgressItem,
          invited: [
            ...prevState.workInProgressItem.invited,
            { ...user, id: item.id, userId: user.id, access: PERMISSION_WRITE },
          ],
        },
        list: updateNode(prevState.list, workInProgressItem.id, {
          ...prevState.workInProgressItem,
          invited: [
            ...prevState.workInProgressItem.invited,
            { ...user, id: item.id, userId: user.id, access: PERMISSION_WRITE },
          ],
        }),
      }));
    } catch (e) {
      console.log(e);
    }
  };

  handleAddNewMember = async email => {
    const { workInProgressItem } = this.state;

    let user = null;

    try {
      const {
        data: { userId, publicKey },
      } = await getPublicKeyByEmail(email);

      user = { email, userId, publicKey, isNew: false };
    } catch (e) {
      const {
        userId,
        password,
        masterPassword,
        publicKey,
      } = await this.createUser(email, USER_ROLE);

      user = {
        userId,
        email,
        password,
        masterPassword,
        publicKey,
        isNew: true,
      };
    }

    const options = {
      message: openpgp.message.fromText(
        JSON.stringify(workInProgressItem.secret),
      ),
      publicKeys: (await openpgp.key.readArmored(user.publicKey)).keys,
    };

    const encryptedSecret = await openpgp.encrypt(options);

    try {
      const {
        data: { items },
      } = await postCreateChildItem(workInProgressItem.id, {
        items: [
          {
            userId: user.userId,
            secret: encryptedSecret.data,
            cause: INVITE_TYPE,
            access: PERMISSION_READ,
          },
        ],
      });

      await postInvitation({
        email,
        url: generateInviteUrl(
          objectToBase64({
            e: email,
            p: user.password,
            mp: user.masterPassword,
          }),
        ),
      });

      this.setState(prevState => ({
        ...prevState,
        workInProgressItem: {
          ...prevState.workInProgressItem,
          invited: [
            ...prevState.workInProgressItem.invited,
            { id: items[0].id, ...user, access: PERMISSION_READ },
          ],
        },
        list: updateNode(prevState.list, workInProgressItem.id, {
          ...prevState.workInProgressItem,
          invited: [
            ...prevState.workInProgressItem.invited,
            { id: items[0].id, ...user, access: PERMISSION_READ },
          ],
        }),
        members: [
          ...prevState.members,
          { ...user, name: user.email, id: user.userId },
        ],
      }));
    } catch (e) {
      console.log(e);
    }
  };

  handleChangePermission = async (userId, permission) => {
    const { workInProgressItem } = this.state;

    const childItem = workInProgressItem.invited.find(
      invite => invite.userId === userId,
    );

    await patchChildAccess(childItem.id, {
      access: permission,
    });

    this.setState(prevState => ({
      ...prevState,
      workInProgressItem: {
        ...prevState.workInProgressItem,
        invited: prevState.workInProgressItem.invited.map(invite =>
          invite.userId === userId ? { ...invite, access: permission } : invite,
        ),
      },
    }));
  };

  handleRemoveInvite = async userId => {
    const { workInProgressItem } = this.state;

    const childItem = workInProgressItem.invited.find(
      invite => invite.userId === userId,
    );

    try {
      await removeChildItem(childItem.id);

      this.setState(prevState => ({
        ...prevState,
        workInProgressItem: {
          ...prevState.workInProgressItem,
          invited: prevState.workInProgressItem.invited.filter(
            invite => invite.userId !== userId,
          ),
        },
      }));
    } catch (e) {
      console.log(e);
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
        data: { items },
      } = await postCreateChildItem(workInProgressItem.id, {
        items: [
          {
            userId,
            secret: encryptedSecret,
            cause: SHARE_TYPE,
            access: PERMISSION_READ,
          },
        ],
      });

      const sharedChildItemId = items[0].id;

      const link = generateSharingUrl(
        sharedChildItemId,
        objectToBase64({
          e: email,
          p: password,
          mp: masterPassword,
        }),
      );

      await patchChildItem(workInProgressItem.id, {
        items: [{ userId, link, secret: encryptedSecret }],
      });

      const shared = {
        id: sharedChildItemId,
        userId,
        email,
        link,
        publicKey,
        isAccepted: false,
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

    const anonymousShare = shared.find(({ link }) => !!link);
    const updatedShared = shared.filter(({ id }) => id !== anonymousShare.id);

    try {
      await removeChildItem(anonymousShare.id);

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

      return { email, userId, publicKey, type: INVITE_TYPE, isNew: false };
    } catch (e) {
      const {
        userId,
        password,
        masterPassword,
        publicKey,
      } = await this.createUser(email, USER_ROLE);

      return {
        userId,
        email,
        password,
        masterPassword,
        publicKey,
        type: INVITE_TYPE,
        isNew: true,
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

    try {
      const promises = await emails.map(this.userResolver);
      const response = await Promise.all(promises);

      const itemInvitedUsers = workInProgressItem.invited.map(
        ({ userId }) => userId,
      );

      const users = response.filter(
        user => !!user && !itemInvitedUsers.includes(user.userId),
      );

      const invitedUsers = users.filter(({ type }) => type === INVITE_TYPE);
      const invitedUserKeys = invitedUsers.map(({ publicKey }) => publicKey);

      const invitedEncryptedSecrets = await encryptItemForUsers(
        workInProgressItem.secret,
        invitedUserKeys,
      );

      const invitedChildItems = invitedEncryptedSecrets.map((secret, idx) => ({
        secret,
        userId: invitedUsers[idx].userId,
        access: PERMISSION_READ,
        cause: INVITE_TYPE,
      }));

      let invited = [];

      if (invitedChildItems.length) {
        const {
          data: { items },
        } = await postCreateChildItem(workInProgressItem.id, {
          items: invitedChildItems,
        });

        invited = items.map(({ id, lastUpdatedAt }, idx) => ({
          id,
          updatedAt: lastUpdatedAt,
          userId: invitedUsers[idx].userId,
          email: invitedUsers[idx].email,
          access: PERMISSION_READ,
        }));

        const invitations = invitedUsers
          .filter(({ isNew }) => !!isNew)
          .map(({ email, password, masterPassword }) => ({
            email,
            url: generateInviteUrl(
              objectToBase64({
                e: email,
                p: password,
                mp: masterPassword,
              }),
            ),
          }));

        await Promise.all(
          invitations.map(async invitation => postInvitation(invitation)),
        );
      }

      const data = {
        ...workInProgressItem,
        invited: [...workInProgressItem.invited, ...invited],
      };

      return this.setState(prevState => ({
        ...prevState,
        workInProgressItem: data,
        isVisibleShareModal: false,
        list: updateNode(prevState.list, workInProgressItem.id, data),
        members: [
          ...prevState.members,
          ...invited.map(({ id, ...user }) => ({
            id: user.userId,
            name: user.email,
            ...user,
          })),
        ],
      }));
    } catch (e) {
      console.log(e.response);
    }
  };

  handleRemoveShare = id => async () => {
    const { workInProgressItem } = this.state;

    try {
      await removeChildItem(id);

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
                onClickMoveItem={this.handleClickMoveItem}
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
            onClickInvite={this.handleInviteMember}
            onClickAddNewMember={this.handleAddNewMember}
            onChangePermission={this.handleChangePermission}
            onRemoveInvite={this.handleRemoveInvite}
            onCancel={this.handleCloseInviteModal}
          />
        )}
        {isVisibleShareModal && (
          <ShareModal
            shared={workInProgressItem.shared}
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
