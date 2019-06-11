import { take, put, call, takeLatest, select, all } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import deepequal from 'fast-deep-equal';
import {
  FETCH_NODES_REQUEST,
  REMOVE_ITEM_REQUEST,
  MOVE_ITEM_REQUEST,
  MOVE_ITEMS,
  CREATE_ITEM_REQUEST,
  EDIT_ITEM_REQUEST,
  ACCEPT_ITEM_UPDATE_REQUEST,
  REJECT_ITEM_UPDATE_REQUEST,
  TOGGLE_ITEM_TO_FAVORITE_REQUEST,
  CHANGE_ITEM_PERMISSION_REQUEST,
  INVITE_MEMBER_REQUEST,
  INVITE_NEW_MEMBER_REQUEST,
  REMOVE_INVITE_REQUEST,
  REMOVE_ITEMS,
  SHARE_ITEM_REQUEST,
  SHARE_ITEMS,
  REMOVE_SHARE_REQUEST,
  CREATE_ANONYMOUS_LINK_REQUEST,
  REMOVE_ANONYMOUS_LINK_REQUEST,
  CREATE_LIST_REQUEST,
  EDIT_LIST_REQUEST,
  REMOVE_LIST_REQUEST,
  SORT_LIST_REQUEST,
  fetchNodesSuccess,
  fetchNodesFailure,
  removeItemSuccess,
  removeItemFailure,
  moveItemSuccess,
  moveItemFailure,
  createItemSuccess,
  createItemFailure,
  editItemSuccess,
  editItemFailure,
  acceptItemUpdateSuccess,
  acceptItemUpdateFailure,
  rejectItemUpdateSuccess,
  rejectItemUpdateFailure,
  toggleItemToFavoriteSuccess,
  toggleItemToFavoriteFailure,
  changeItemPermissionSuccess,
  changeItemPermissionFailure,
  inviteMemberSuccess,
  inviteMemberFailure,
  inviteNewMemberFailure,
  removeInviteMemberSuccess,
  removeInviteMemberFailure,
  shareItemSuccess,
  removeShareSuccess,
  removeShareFailure,
  createAnonymousLinkSuccess,
  createAnonymousLinkFailure,
  removeAnonymousLinkSuccess,
  removeAnonymousLinkFailure,
  createListSuccess,
  createListFailure,
  editListSuccess,
  editListFailure,
  removeListSuccess,
  removeListFailure,
  sortListSuccess,
  sortListFailure,
  addItem,
  setWorkInProgressItem,
  setWorkInProgressListId,
  shareItemFailure,
} from 'common/actions/node';
import { normalizeNodes } from 'common/normalizers/node';
import {
  keyPairSelector,
  masterPasswordSelector,
  userDataSelector,
} from 'common/selectors/user';
import { memberListSelector } from 'common/selectors/member';
import {
  defaultListSelector,
  workInProgressItemSelector,
  workInProgressItemIdsSelector,
  favoritesSelector,
  parentListSelector,
  sortedCustomizableListsSelector,
  itemsByIdSelector,
  selectableListsSelector,
} from 'common/selectors/node';
import {
  getList,
  removeItem,
  updateMoveItem,
  postCreateItem,
  updateItem,
  patchChildItemBatch,
  acceptUpdateItem,
  rejectUpdateItem,
  toggleFavorite,
  patchChildAccess,
  postCreateChildItem,
  postInvitation,
  removeChildItem,
  patchChildItem,
  removeList,
  postCreateList,
  patchListSort,
  patchList,
} from 'common/api';
import DecryptWorker from 'common/decryption.worker.js';
import {
  encryptItem,
  encryptItemForUsers,
  getPrivateKeyObj,
  decryptItem,
  objectToBase64,
  generateAnonymousEmail,
} from 'common/utils/cipherUtils';
import {
  ANONYMOUS_USER_ROLE,
  INVITE_TYPE,
  ITEM_REVIEW_MODE,
  LIST_TYPE,
  PERMISSION_READ,
  PERMISSION_WRITE,
  SHARE_TYPE,
  USER_ROLE,
} from 'common/constants';
import { generateInviteUrl, generateSharingUrl } from 'common/utils/sharing';
import { createMemberSaga, getOrCreateMemberSaga } from './member';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const fixSort = lists => lists.map((list, index) => ({ ...list, sort: index }));

function createWebWorkerChannel(data) {
  const worker = new DecryptWorker();

  worker.postMessage({ event: `decryptItems_${data.listId}`, data });

  return eventChannel(emitter => {
    worker.onmessage = ({ data: { event, item } }) => {
      if (event === `emitDecryptedItem_${data.listId}`) {
        emitter(item);
      }
    };

    return () => worker.terminate();
  });
}

export function* decryptSaga({ listId, items }) {
  const keyPair = yield select(keyPairSelector);
  const masterPassword = yield select(masterPasswordSelector);

  const channel = yield call(createWebWorkerChannel, {
    listId,
    items,
    privateKey: keyPair.privateKey,
    masterPassword,
  });

  while (channel) {
    try {
      const item = yield take(channel);

      yield put(addItem(item));
    } catch (error) {
      console.log(error);
    }
  }
}

export function* fetchNodesSaga() {
  try {
    const { data } = yield call(getList);

    const { listsById, itemsById } = normalizeNodes(data);

    yield put(fetchNodesSuccess(listsById));

    const defaultList = yield select(defaultListSelector);

    yield put(setWorkInProgressListId(defaultList.id));

    const selectableLists = yield select(selectableListsSelector);

    const lists = selectableLists.map(({ id, children }) => ({
      listId: id,
      items: children.map(({ id: itemId }) => itemsById[itemId]),
    }));

    yield all(lists.map(list => call(decryptSaga, list)));
  } catch (error) {
    console.log(error);

    yield put(fetchNodesFailure());
  }
}

export function* removeItemSaga({ payload: { itemId, listId } }) {
  try {
    yield call(removeItem, itemId);
    yield put(removeItemSuccess(itemId, listId));
  } catch (error) {
    console.log(error);

    yield put(removeItemFailure());
  }
}

export function* moveItemSaga({ payload: { listId } }) {
  try {
    const workInProgressItem = yield select(workInProgressItemSelector);

    yield call(updateMoveItem, workInProgressItem.id, { listId });
    yield put(
      moveItemSuccess(workInProgressItem.id, workInProgressItem.listId, listId),
    );
  } catch (error) {
    console.log(error);

    yield put(moveItemFailure());
  }
}

export function* createItemSaga({
  payload: { item },
  meta: { setSubmitting },
}) {
  try {
    const { listId, attachments, type, ...secret } = item;

    const keyPair = yield select(keyPairSelector);
    const user = yield select(userDataSelector);

    const encryptedItem = yield call(
      encryptItem,
      { attachments, ...secret },
      keyPair.publicKey,
    );

    const {
      data: { id: itemId, lastUpdated },
    } = yield call(postCreateItem, {
      listId,
      type,
      secret: encryptedItem,
    });

    const newItem = {
      id: itemId,
      listId,
      lastUpdated,
      favorite: false,
      invited: [],
      shared: [],
      tags: [],
      owner: user,
      secret: { attachments, ...secret },
      type,
    };

    yield put(createItemSuccess(newItem));
    yield put(setWorkInProgressItem(newItem, ITEM_REVIEW_MODE));
  } catch (error) {
    console.log(error);

    yield put(createItemFailure());
  } finally {
    setSubmitting(false);
  }
}

export function* editItemSaga({ payload: { item }, meta: { setSubmitting } }) {
  try {
    const { listId, attachments, type, ...secret } = item;

    const keyPair = yield select(keyPairSelector);
    const workInProgressItem = yield select(workInProgressItemSelector);
    const members = yield select(memberListSelector);
    const user = yield select(userDataSelector);

    const editedItemSecret = {
      attachments,
      ...secret,
    };

    const editedItem = {
      ...workInProgressItem,
      listId,
      secret: editedItemSecret,
    };

    const isSecretChanged = !deepequal(
      workInProgressItem.secret,
      editedItemSecret,
    );
    const isListIdChanged = listId !== workInProgressItem.listId;

    if (isListIdChanged) {
      yield call(moveItemSaga, { payload: { listId } });
    }

    if (isSecretChanged) {
      const encryptedItemSecret = yield call(
        encryptItem,
        editedItemSecret,
        keyPair.publicKey,
      );
      const { invited, shared } = workInProgressItem;

      const filteredInvited = invited.filter(
        ({ userId }) => userId !== user.id,
      );

      if (!filteredInvited.length) {
        const requestData = {
          item: {
            secret: encryptedItemSecret,
          },
        };

        if (workInProgressItem.originalItemId) {
          const encryptedOriginalItemSecret = call(
            encryptItem,
            editedItemSecret,
            workInProgressItem.owner.publicKey,
          );

          requestData.originalItem = {
            secret: encryptedOriginalItemSecret,
          };
        }

        yield call(updateItem, workInProgressItem.id, requestData);
      } else {
        const invitedMembersIds = filteredInvited.map(({ userId }) => userId);
        const invitedMemberKeys = members
          .filter(({ id }) => invitedMembersIds.includes(id))
          .map(member => member.publicKey);

        const invitedEncryptedSecrets = yield call(
          encryptItemForUsers,
          editedItemSecret,
          invitedMemberKeys,
        );

        const invitedChildItems = invitedEncryptedSecrets.map(
          (encrypt, index) => ({
            userId: invitedMembersIds[index],
            secret: encrypt,
          }),
        );

        if (invitedChildItems.length) {
          yield call(patchChildItemBatch, {
            collectionItems: [
              {
                originalItem: workInProgressItem.id,
                items: [
                  ...invitedChildItems,
                  { userId: user.id, secret: encryptedItemSecret },
                ],
              },
            ],
          });
        }
      }

      if (shared.length) {
        const sharedMembersIds = shared.map(({ userId }) => userId);
        const sharedUserKeys = shared.map(member => member.publicKey);

        const sharedEncryptedSecrets = yield call(
          encryptItemForUsers,
          editedItemSecret,
          sharedUserKeys,
        );

        const sharedChildItems = sharedEncryptedSecrets.map((encrypt, idx) => ({
          userId: sharedMembersIds[idx],
          secret: encrypt,
        }));

        if (sharedChildItems.length) {
          yield call(patchChildItemBatch, {
            collectionItems: [
              {
                originalItem: workInProgressItem.id,
                items: sharedChildItems,
              },
            ],
          });
        }
      }

      yield put(editItemSuccess(editedItem));
    }

    yield put(setWorkInProgressItem(editedItem, ITEM_REVIEW_MODE));
  } catch (error) {
    console.log(error);

    yield put(editItemFailure());
  } finally {
    setSubmitting(false);
  }
}

export function* acceptItemSaga({ payload: { id } }) {
  try {
    const workInProgressItem = yield select(workInProgressItemSelector);
    const keyPair = yield select(keyPairSelector);
    const masterPassword = yield select(masterPasswordSelector);

    const {
      data: { secret, ...itemData },
    } = yield call(acceptUpdateItem, id);

    const privateKeyObj = yield call(
      getPrivateKeyObj,
      keyPair.privateKey,
      masterPassword,
    );

    const decryptedItemSecret = yield decryptItem(secret, privateKeyObj);

    const newItem = { ...itemData, secret: decryptedItemSecret };

    yield put(acceptItemUpdateSuccess(newItem));
    yield put(
      setWorkInProgressItem(
        { ...workInProgressItem, ...newItem },
        ITEM_REVIEW_MODE,
      ),
    );
  } catch (error) {
    console.error(error);
    yield put(acceptItemUpdateFailure(error));
  }
}

export function* rejectItemSaga({ payload: { id } }) {
  try {
    yield call(rejectUpdateItem, id);

    yield put(rejectItemUpdateSuccess(id));
  } catch (error) {
    console.log(error);
    yield put(rejectItemUpdateFailure(error));
  }
}

export function* toggleItemToFavoriteSaga({ payload: { itemId } }) {
  try {
    const favoritesList = yield select(favoritesSelector);
    const { data } = yield call(toggleFavorite, itemId);

    yield put(
      toggleItemToFavoriteSuccess(itemId, favoritesList.id, data.favorite),
    );
  } catch (error) {
    console.log(error);
    yield put(toggleItemToFavoriteFailure());
  }
}

export function* changeItemPermissionSaga({ payload: { userId, permission } }) {
  try {
    const workInProgressItem = yield select(workInProgressItemSelector);

    const childItem = workInProgressItem.invited.find(
      invite => invite.userId === userId,
    );

    yield call(patchChildAccess, childItem.id, { access: permission });
    yield put(
      changeItemPermissionSuccess(workInProgressItem.id, userId, permission),
    );
  } catch (error) {
    yield put(changeItemPermissionFailure());
  }
}

export function* inviteMemberSaga({ payload: { userId } }) {
  try {
    const workInProgressItem = yield select(workInProgressItemSelector);
    const members = yield select(memberListSelector);

    const member = members.find(({ id }) => id === userId);

    const encryptedItemSecret = yield call(
      encryptItem,
      workInProgressItem.secret,
      member.publicKey,
    );

    const {
      data: { items },
    } = yield call(postCreateChildItem, workInProgressItem.id, {
      items: [
        {
          userId: member.id,
          secret: encryptedItemSecret,
          cause: INVITE_TYPE,
          access: PERMISSION_WRITE,
        },
      ],
    });

    yield put(inviteMemberSuccess(workInProgressItem.id, items[0].id, member));
  } catch (error) {
    console.log(error);
    yield put(inviteMemberFailure());
  }
}

export function* inviteNewMemberSaga({ payload: { email } }) {
  try {
    const { id, masterPassword, password } = yield call(createMemberSaga, {
      payload: {
        email,
        role: USER_ROLE,
      },
    });

    yield call(inviteMemberSaga, { payload: { userId: id } });

    yield call(postInvitation, {
      email,
      url: generateInviteUrl(
        objectToBase64({
          e: email,
          p: password,
          mp: masterPassword,
        }),
      ),
    });
  } catch (error) {
    console.log(error);
    yield put(inviteNewMemberFailure());
  }
}

export function* removeInviteMemberSaga({ payload: { userId } }) {
  try {
    const workInProgressItem = yield select(workInProgressItemSelector);

    const childItem = workInProgressItem.invited.find(
      invite => invite.userId === userId,
    );

    yield call(removeChildItem, childItem.id);

    yield put(removeInviteMemberSuccess(workInProgressItem.id, userId));
  } catch (error) {
    console.log(error);
    yield put(removeInviteMemberFailure());
  }
}

export function* shareItemSaga({ payload: { item, emails } }) {
  try {
    const itemInvitedUsers = item.invited.map(({ userId }) => userId);

    const response = yield all(
      emails.map(email =>
        call(getOrCreateMemberSaga, { payload: { email, role: USER_ROLE } }),
      ),
    );

    const users = response.filter(
      user => !!user && !itemInvitedUsers.includes(user.userId),
    );

    const userKeys = users.map(({ publicKey }) => publicKey);

    const invitedEncryptedSecrets = yield call(
      encryptItemForUsers,
      item.secret,
      userKeys,
    );

    const invitedChildItems = invitedEncryptedSecrets.map((secret, idx) => ({
      secret,
      userId: users[idx].userId,
      access: PERMISSION_READ,
      cause: INVITE_TYPE,
    }));

    let invited = [];

    if (invitedChildItems.length) {
      const {
        data: { items },
      } = yield call(postCreateChildItem, item.id, {
        items: invitedChildItems,
      });

      invited = items.map(({ id, lastUpdatedAt }, idx) => ({
        id,
        updatedAt: lastUpdatedAt,
        userId: users[idx].userId,
        email: users[idx].email,
        access: PERMISSION_READ,
      }));

      const invitations = users
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

      yield all([...invitations.map(invitation => postInvitation(invitation))]);
    }

    yield put(shareItemSuccess(item.id, invited));
  } catch (error) {
    console.log(error);
    yield put(shareItemFailure());
  }
}

export function* removeShareSaga({ payload: { shareId } }) {
  try {
    const workInProgressItem = yield select(workInProgressItemSelector);

    yield call(removeChildItem, shareId);

    yield put(removeShareSuccess(workInProgressItem.id, shareId));
  } catch (error) {
    console.log(error);
    yield put(removeShareFailure());
  }
}

export function* createAnonymousLinkSaga() {
  try {
    const workInProgressItem = yield select(workInProgressItemSelector);

    const email = generateAnonymousEmail();

    const {
      id: userId,
      name,
      password,
      masterPassword,
      publicKey,
    } = yield call(createMemberSaga, {
      payload: {
        email,
        role: ANONYMOUS_USER_ROLE,
      },
    });

    const encryptedSecret = yield call(
      encryptItem,
      workInProgressItem.secret,
      publicKey,
    );

    const {
      data: { items },
    } = yield call(postCreateChildItem, workInProgressItem.id, {
      items: [
        {
          userId,
          secret: encryptedSecret,
          cause: SHARE_TYPE,
          access: PERMISSION_READ,
        },
      ],
    });

    const link = generateSharingUrl(
      items[0].id,
      objectToBase64({
        e: email,
        p: password,
        mp: masterPassword,
      }),
    );

    yield call(patchChildItem, workInProgressItem.id, {
      items: [{ userId, link, secret: encryptedSecret }],
    });

    yield put(
      createAnonymousLinkSuccess(workInProgressItem.id, {
        id: items[0].id,
        userId,
        email,
        name,
        link,
        publicKey,
        isAccepted: false,
        roles: [ANONYMOUS_USER_ROLE],
      }),
    );
  } catch (error) {
    console.log(error);
    yield put(createAnonymousLinkFailure());
  }
}

export function* removeAnonymousLinkSaga() {
  try {
    const workInProgressItem = yield select(workInProgressItemSelector);

    yield call(removeChildItem, workInProgressItem.shared[0].id);

    yield put(removeAnonymousLinkSuccess(workInProgressItem.id));
  } catch (error) {
    console.log(error);
    yield put(removeAnonymousLinkFailure());
  }
}

export function* createListSaga({ payload: { list } }) {
  try {
    const parentList = yield select(parentListSelector);

    const {
      data: { id: listId },
    } = yield call(postCreateList, {
      label: list.label,
      parentId: parentList.id,
    });

    yield put(
      createListSuccess(listId, {
        id: listId,
        type: LIST_TYPE,
        children: [],
        sort: 0,
        parentId: parentList.id,
        ...list,
      }),
    );
  } catch (error) {
    console.log(error);
    yield put(createListFailure());
  }
}

export function* editListSaga({ payload: { list } }) {
  try {
    yield call(patchList, list.id, { label: list.label });

    yield put(editListSuccess(list));
  } catch (error) {
    console.log(error);
    yield put(editListFailure());
  }
}

export function* removeListSaga({ payload: { listId } }) {
  try {
    yield call(removeList, listId);

    yield put(removeListSuccess(listId));
  } catch (error) {
    console.log(error);
    yield put(removeListFailure());
  }
}

export function* sortListSaga({
  payload: { listId, sourceIndex, destinationIndex },
}) {
  try {
    const sortedCustomizableLists = yield select(
      sortedCustomizableListsSelector,
    );

    yield put(
      sortListSuccess(
        fixSort(
          reorder(sortedCustomizableLists, sourceIndex, destinationIndex),
        ).reduce((acc, list) => ({ ...acc, [list.id]: list }), {}),
      ),
    );

    yield call(patchListSort, listId, { sort: destinationIndex });
  } catch (error) {
    console.log(error);
    yield put(sortListFailure());
  }
}

export function* moveItemsSaga({ payload: { listId } }) {
  try {
    const workInProgressItemIds = yield select(workInProgressItemIdsSelector);
    const itemsById = yield select(itemsByIdSelector);

    const items = workInProgressItemIds.map(itemId => itemsById[itemId]);
    const movingItems = items.filter(item => item.listId !== listId);

    if (movingItems.length > 0) {
      yield all(
        movingItems.map(item => call(updateMoveItem, item.id, { listId })),
      );
      yield all(
        movingItems.map(item =>
          put(moveItemSuccess(item.id, item.listId, listId)),
        ),
      );
    }
  } catch (error) {
    console.log(error);
  }
}

export function* removeItemsSaga() {
  try {
    const workInProgressItemIds = yield select(workInProgressItemIdsSelector);
    const itemsById = yield select(itemsByIdSelector);

    const items = workInProgressItemIds.map(itemId => itemsById[itemId]);

    yield all(items.map(item => call(removeItem, item.id)));
    yield all(items.map(item => put(removeItemSuccess(item.id, item.listId))));
  } catch (error) {
    console.log(error);
  }
}

export function* shareItemsSaga({ payload: { emails } }) {
  try {
    const workInProgressItemIds = yield select(workInProgressItemIdsSelector);
    const itemsById = yield select(itemsByIdSelector);

    const sharedItems = workInProgressItemIds.map(itemId => itemsById[itemId]);

    for (const item of sharedItems) {
      const response = yield all(
        emails.map(email =>
          call(getOrCreateMemberSaga, { payload: { email, role: USER_ROLE } }),
        ),
      );

      const itemInvitedUsers = item.invited.map(({ userId }) => userId);

      const users = response.filter(
        user => !!user && !itemInvitedUsers.includes(user.userId),
      );

      const userKeys = users.map(({ publicKey }) => publicKey);

      const invitedEncryptedSecrets = yield call(
        encryptItemForUsers,
        item.secret,
        userKeys,
      );

      const invitedChildItems = invitedEncryptedSecrets.map((secret, idx) => ({
        secret,
        userId: users[idx].userId,
        access: PERMISSION_READ,
        cause: INVITE_TYPE,
      }));

      let invited = [];

      if (invitedChildItems.length) {
        const {
          data: { items },
        } = yield call(postCreateChildItem, item.id, {
          items: invitedChildItems,
        });

        invited = items.map(({ id, lastUpdatedAt }, idx) => ({
          id,
          updatedAt: lastUpdatedAt,
          userId: users[idx].userId,
          email: users[idx].email,
          access: PERMISSION_READ,
        }));

        const invitations = users
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

        yield all(invitations.map(invitation => postInvitation(invitation)));
      }

      yield put(shareItemSuccess(item.id, invited));
    }
  } catch (error) {
    console.log(error);
  }
}

export function* nodeSagas() {
  yield takeLatest(FETCH_NODES_REQUEST, fetchNodesSaga);
  yield takeLatest(REMOVE_ITEM_REQUEST, removeItemSaga);
  yield takeLatest(MOVE_ITEM_REQUEST, moveItemSaga);
  yield takeLatest(CREATE_ITEM_REQUEST, createItemSaga);
  yield takeLatest(EDIT_ITEM_REQUEST, editItemSaga);
  yield takeLatest(ACCEPT_ITEM_UPDATE_REQUEST, acceptItemSaga);
  yield takeLatest(REJECT_ITEM_UPDATE_REQUEST, rejectItemSaga);
  yield takeLatest(TOGGLE_ITEM_TO_FAVORITE_REQUEST, toggleItemToFavoriteSaga);
  yield takeLatest(CHANGE_ITEM_PERMISSION_REQUEST, changeItemPermissionSaga);
  yield takeLatest(INVITE_MEMBER_REQUEST, inviteMemberSaga);
  yield takeLatest(INVITE_NEW_MEMBER_REQUEST, inviteNewMemberSaga);
  yield takeLatest(REMOVE_INVITE_REQUEST, removeInviteMemberSaga);
  yield takeLatest(SHARE_ITEM_REQUEST, shareItemSaga);
  yield takeLatest(REMOVE_SHARE_REQUEST, removeShareSaga);
  yield takeLatest(CREATE_ANONYMOUS_LINK_REQUEST, createAnonymousLinkSaga);
  yield takeLatest(REMOVE_ANONYMOUS_LINK_REQUEST, removeAnonymousLinkSaga);
  yield takeLatest(CREATE_LIST_REQUEST, createListSaga);
  yield takeLatest(EDIT_LIST_REQUEST, editListSaga);
  yield takeLatest(REMOVE_LIST_REQUEST, removeListSaga);
  yield takeLatest(SORT_LIST_REQUEST, sortListSaga);
  yield takeLatest(MOVE_ITEMS, moveItemsSaga);
  yield takeLatest(REMOVE_ITEMS, removeItemsSaga);
  yield takeLatest(SHARE_ITEMS, shareItemsSaga);
}
