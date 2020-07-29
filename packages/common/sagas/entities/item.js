import Router from 'next/router';
import {
  put,
  call,
  takeLatest,
  select,
  fork,
  take,
  all,
} from 'redux-saga/effects';
import deepequal from 'fast-deep-equal';
import {
  ACCEPT_ITEM_UPDATE_REQUEST,
  CREATE_ITEM_REQUEST,
  CREATE_ITEMS_BATCH_REQUEST,
  EDIT_ITEM_REQUEST,
  UPDATE_ITEM_REQUEST,
  MOVE_ITEM_REQUEST,
  MOVE_ITEMS_BATCH_REQUEST,
  REJECT_ITEM_UPDATE_REQUEST,
  REMOVE_ITEM_REQUEST,
  REMOVE_ITEMS_BATCH_REQUEST,
  TOGGLE_ITEM_TO_FAVORITE_REQUEST,
  CREATE_ANONYMOUS_LINK_REQUEST,
  REMOVE_ANONYMOUS_LINK_REQUEST,
  SHARE_ITEM_BATCH_REQUEST,
  REMOVE_SHARE_REQUEST,
  acceptItemUpdateSuccess,
  acceptItemUpdateFailure,
  createItemSuccess,
  createItemFailure,
  createItemsBatchSuccess,
  createItemsBatchFailure,
  editItemFailure,
  updateItemSuccess,
  updateItemFailure,
  moveItemSuccess,
  moveItemFailure,
  moveItemsBatchFailure,
  rejectItemUpdateSuccess,
  rejectItemUpdateFailure,
  removeItemSuccess,
  removeItemFailure,
  removeItemsBatchSuccess,
  removeItemsBatchFailure,
  toggleItemToFavoriteSuccess,
  toggleItemToFavoriteFailure,
  createAnonymousLinkSuccess,
  createAnonymousLinkFailure,
  removeAnonymousLinkSuccess,
  removeAnonymousLinkFailure,
  removeChildItemFromItem,
  removeChildItemsBatchFromItem,
  shareItemBatchSuccess,
  shareItemBatchFailure,
  removeShareSuccess,
  removeShareFailure,
  addChildItemsBatchToItems,
  updateItemField,
} from '@caesar/common/actions/entities/item';
import {
  addItemToList,
  addItemsBatchToList,
  moveItemToList,
  removeItemFromList,
  removeItemsBatchFromList,
  toggleItemToFavoriteList,
} from '@caesar/common/actions/entities/list';
import {
  CREATE_CHILD_ITEM_BATCH_FINISHED_EVENT,
  removeChildItemsBatch,
} from '@caesar/common/actions/entities/childItem';
import { setCurrentTeamId } from '@caesar/common/actions/user';
import { updateGlobalNotification } from '@caesar/common/actions/application';
import {
  createChildItemBatchSaga,
  updateChildItemsBatchSaga,
} from '@caesar/common/sagas/entities/childItem';
import {
  prepareUsersForSharing,
  getItemUserPairs,
} from '@caesar/common/sagas/common/share';
import { inviteNewMemberBatchSaga } from '@caesar/common/sagas/common/invite';
import {
  setWorkInProgressItem,
  updateWorkInProgressItem,
  setWorkInProgressListId,
} from '@caesar/common/actions/workflow';
import {
  workInProgressItemSelector,
  workInProgressItemIdsSelector,
} from '@caesar/common/selectors/workflow';
import {
  favoriteListSelector,
  teamsFavoriteListSelector,
  listSelector,
} from '@caesar/common/selectors/entities/list';
import {
  itemsBatchSelector,
  itemSelector,
} from '@caesar/common/selectors/entities/item';
import { membersBatchSelector } from '@caesar/common/selectors/entities/member';
import {
  keyPairSelector,
  masterPasswordSelector,
  userDataSelector,
  currentTeamIdSelector,
} from '@caesar/common/selectors/user';
import {
  teamSelector,
  teamsMembersSelector,
} from '@caesar/common/selectors/entities/team';
import {
  acceptUpdateItem,
  patchChildItem,
  postCreateChildItem,
  postCreateItem,
  postCreateItemsBatch,
  rejectUpdateItem,
  deleteChildItem,
  removeItem,
  removeItemsBatch,
  toggleFavorite,
  updateItem,
  updateMoveItem,
} from '@caesar/common/api';
import {
  decryptItem,
  encryptItem,
  encryptItemsBatch,
  generateAnonymousEmail,
  getPrivateKeyObj,
} from '@caesar/common/utils/cipherUtils';
import { getServerErrorMessage } from '@caesar/common/utils/error';
import { objectToBase64 } from '@caesar/common/utils/base64';
import { chunk } from '@caesar/common/utils/utils';
import {
  ROLE_ANONYMOUS_USER,
  PERMISSION_READ,
  SHARE_TYPE,
  ENTITY_TYPE,
  CREATING_ITEM_NOTIFICATION,
  CREATING_ITEMS_NOTIFICATION,
  SHARING_IN_PROGRESS_NOTIFICATION,
  ENCRYPTING_ITEM_NOTIFICATION,
  MOVING_IN_PROGRESS_NOTIFICATION,
  REMOVING_IN_PROGRESS_NOTIFICATION,
  NOOP_NOTIFICATION,
  ROUTES,
  TEAM_TYPE,
} from '@caesar/common/constants';
import { generateSharingUrl } from '@caesar/common/utils/sharing';
import { createMemberSaga } from './member';

const ITEMS_CHUNK_SIZE = 50;

export function* removeItemSaga({ payload: { itemId, listId } }) {
  try {
    yield put(
      updateGlobalNotification(REMOVING_IN_PROGRESS_NOTIFICATION, true),
    );

    const item = yield select(itemSelector, { itemId });

    yield call(removeItem, itemId);

    yield put(removeItemFromList(itemId, listId));
    yield put(removeItemSuccess(itemId, listId));

    if (item.invited && item.invited.length > 0) {
      yield put(removeChildItemsBatch(item.invited));
    }

    if (item.favorite) {
      const favoriteList = yield select(favoriteListSelector);
      yield put(removeItemFromList(itemId, favoriteList.id));
    }

    yield put(setWorkInProgressItem(null));
    yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));
  } catch (error) {
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(removeItemFailure());
  }
}

export function* removeItemsBatchSaga({ payload: { listId } }) {
  try {
    yield put(
      updateGlobalNotification(REMOVING_IN_PROGRESS_NOTIFICATION, true),
    );

    const workInProgressItemIds = yield select(workInProgressItemIdsSelector);

    const itemIdsChunks = chunk(workInProgressItemIds, ITEMS_CHUNK_SIZE);

    yield all(
      itemIdsChunks.map(itemIdsChunk =>
        call(
          removeItemsBatch,
          itemIdsChunk.map(id => `items[]=${id}`).join('&'),
        ),
      ),
    );

    yield put(setWorkInProgressItem(null));
    yield put(removeItemsBatchSuccess(workInProgressItemIds, listId));

    yield put(removeItemsBatchFromList(workInProgressItemIds, listId));

    yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));
  } catch (error) {
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(removeItemsBatchFailure());
  }
}

export function* shareItemBatchSaga({
  payload: {
    data: { itemIds = [], members = [], teamIds = [] },
    options: { includeIniciator = true },
  },
}) {
  try {
    yield put(updateGlobalNotification(SHARING_IN_PROGRESS_NOTIFICATION, true));

    const user = yield select(userDataSelector);
    const items = yield select(itemsBatchSelector, { itemIds });

    const preparedMembers = yield call(prepareUsersForSharing, members);

    const newMembers = preparedMembers.filter(({ isNew }) => isNew);

    const directMembers = preparedMembers.map(member => ({
      ...member,
      teamId: null,
    }));

    const teamsMembers = yield select(teamsMembersSelector, { teamIds });

    const preparedTeamsMembers = includeIniciator
      ? teamsMembers
      : teamsMembers.filter(member => member.id !== user.id);

    const allMembers = [...directMembers, ...preparedTeamsMembers];

    const itemUserPairs = yield call(getItemUserPairs, {
      items,
      members: allMembers,
    });

    if (newMembers.length > 0) {
      yield fork(inviteNewMemberBatchSaga, {
        payload: { members: newMembers },
      });
    }

    if (itemUserPairs.length > 0) {
      yield fork(createChildItemBatchSaga, { payload: { itemUserPairs } });

      const {
        payload: { childItems },
      } = yield take(CREATE_CHILD_ITEM_BATCH_FINISHED_EVENT);

      const shares = childItems.reduce(
        (accumulator, item) => [
          ...accumulator,
          {
            itemId: item.originalItemId,
            childItemIds: item.items.map(({ id }) => id),
          },
        ],
        [],
      );

      yield put(shareItemBatchSuccess(shares));

      yield put(updateWorkInProgressItem());
    }

    yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));
  } catch (error) {
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(shareItemBatchFailure());
  }
}

export function* removeShareSaga({ payload: { shareId } }) {
  try {
    const workInProgressItem = yield select(workInProgressItemSelector);

    yield call(deleteChildItem, shareId);

    yield put(removeChildItemFromItem(workInProgressItem.id, shareId));
    yield put(removeShareSuccess(workInProgressItem.id, shareId));
    yield put(updateWorkInProgressItem());

    yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));
  } catch (error) {
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(removeShareFailure());
  }
}

export function* toggleItemToFavoriteSaga({ payload: { item } }) {
  try {
    const favoritesList = item.teamId
      ? yield select(teamsFavoriteListSelector)
      : yield select(favoriteListSelector);

    const {
      data: { favorite: isFavorite },
    } = yield call(toggleFavorite, item.id);

    yield put(
      toggleItemToFavoriteSuccess(item.id, favoritesList.id, isFavorite),
    );
    yield put(toggleItemToFavoriteList(item.id, favoritesList.id, isFavorite));
    yield put(updateWorkInProgressItem(item.id));
  } catch (error) {
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(toggleItemToFavoriteFailure());
  }
}

export function* moveItemSaga({ payload: { itemId, teamId, listId } }) {
  try {
    yield put(updateGlobalNotification(MOVING_IN_PROGRESS_NOTIFICATION, true));

    const item = yield select(itemSelector, { itemId });
    const childItemIds = item.invited;

    yield call(updateMoveItem, item.id, {
      listId,
    });
    yield put(moveItemSuccess(item.id, item.listId, listId));
    yield put(moveItemToList(item.id, item.listId, listId));

    yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));

    if (item.teamId !== teamId) {
      yield put(updateItemField(item.id, 'teamId', teamId));
    }

    if (!item.teamId && teamId) {
      yield fork(shareItemBatchSaga, {
        payload: {
          data: {
            itemIds: [item.id],
            members: [],
            teamIds: [teamId],
          },
          options: {
            includeIniciator: false,
          },
        },
      });
    }

    if (item.teamId && !teamId) {
      yield put(removeChildItemsBatchFromItem(item.id, childItemIds));
      yield put(removeChildItemsBatch(childItemIds));

      yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));
    }

    if (item.teamId && teamId && item.teamId !== teamId) {
      yield put(removeChildItemsBatchFromItem(item.id, childItemIds));
      yield put(removeChildItemsBatch(childItemIds));

      yield fork(shareItemBatchSaga, {
        payload: {
          data: {
            itemIds: [item.id],
            members: [],
            teamIds: [teamId],
          },
          options: {
            includeIniciator: false,
          },
        },
      });
    }
  } catch (error) {
    console.log(error);
    yield put(moveItemFailure());
  }
}

export function* moveItemsBatchSaga({ payload: { itemIds, teamId, listId } }) {
  try {
    yield all(
      itemIds.map(itemId =>
        call(moveItemSaga, { payload: { itemId, teamId, listId } }),
      ),
    );
  } catch (error) {
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(moveItemsBatchFailure());
  }
}

export function* createItemSaga({
  payload: { item },
  meta: { setSubmitting },
}) {
  try {
    yield put(updateGlobalNotification(ENCRYPTING_ITEM_NOTIFICATION, true));

    const { teamId, listId, attachments, type, ...data } = item;

    const keyPair = yield select(keyPairSelector);
    const user = yield select(userDataSelector);

    const encryptedItem = yield call(
      encryptItem,
      { attachments, ...data },
      keyPair.publicKey,
    );

    yield put(updateGlobalNotification(CREATING_ITEM_NOTIFICATION, true));

    const {
      data: { id: itemId, lastUpdated, _links },
    } = yield call(postCreateItem, {
      listId,
      type,
      secret: encryptedItem,
    });

    const newItem = {
      id: itemId,
      listId,
      lastUpdated,
      type,
      favorite: false,
      invited: [],
      shared: null,
      tags: [],
      teamId,
      ownerId: user.id,
      secret: encryptedItem,
      data: { attachments, ...data },
      _links,
      __type: ENTITY_TYPE.ITEM,
    };

    yield put(createItemSuccess(newItem));

    const currentTeamId = yield select(currentTeamIdSelector);

    if (
      currentTeamId === teamId ||
      (!teamId && currentTeamId === TEAM_TYPE.PERSONAL)
    ) {
      yield put(addItemToList(newItem));
    }

    if (teamId) {
      yield put(
        updateGlobalNotification(SHARING_IN_PROGRESS_NOTIFICATION, true),
      );

      const team = yield select(teamSelector, { teamId });
      const memberIds = team.users.map(({ id }) => id);
      const members = yield select(membersBatchSelector, { memberIds });

      const itemUserPairs = members
        .filter(({ id }) => id !== user.id)
        .map(({ id, publicKey }) => ({
          item: { id: itemId, data: newItem.data },
          user: { id, publicKey, teamId },
        }));

      if (itemUserPairs.length > 0) {
        yield fork(createChildItemBatchSaga, {
          payload: { itemUserPairs },
        });

        const {
          payload: { childItems },
        } = yield take(CREATE_CHILD_ITEM_BATCH_FINISHED_EVENT);

        const shares = childItems.reduce(
          // eslint-disable-next-line
          (accumulator, item) => [
            ...accumulator,
            {
              itemId: item.originalItemId,
              childItemIds: item.items.map(({ id }) => id),
            },
          ],
          [],
        );

        yield put(addChildItemsBatchToItems(shares));
        yield put(updateWorkInProgressItem());
      }
    }

    yield put(setCurrentTeamId(teamId || TEAM_TYPE.PERSONAL));
    yield put(setWorkInProgressListId(listId));
    yield put(setWorkInProgressItem(newItem));

    yield call(Router.push, ROUTES.DASHBOARD);
  } catch (error) {
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(createItemFailure());
  } finally {
    yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));
    setSubmitting(false);
  }
}

export function* createItemsBatchSaga({
  payload: { items, listId },
  meta: { setSubmitting },
}) {
  try {
    yield put(updateGlobalNotification(CREATING_ITEMS_NOTIFICATION, true));

    const list = yield select(listSelector, { listId });
    const keyPair = yield select(keyPairSelector);
    const user = yield select(userDataSelector);

    const preparedForEncryptingItems = items.map(
      ({ attachments, type, ...data }) => ({
        attachments,
        ...data,
      }),
    );

    const encryptedItems = yield call(
      encryptItemsBatch,
      preparedForEncryptingItems,
      keyPair.publicKey,
    );

    const preparedForRequestItems = items.map(({ type }, index) => ({
      type,
      listId,
      secret: encryptedItems[index],
    }));

    const { data } = yield call(postCreateItemsBatch, {
      items: preparedForRequestItems,
    });

    const preparedForStoreItems = data.map((item, index) => ({
      id: item.id,
      listId,
      lastUpdated: item.lastUpdated,
      favorite: false,
      invited: [],
      shared: null,
      tags: [],
      owner: user.id,
      data: preparedForEncryptingItems[index],
      type: items[index].type,
    }));

    yield put(createItemsBatchSuccess(preparedForStoreItems));
    yield put(addItemsBatchToList(data.map(({ id }) => id), listId));

    if (list.teamId) {
      yield fork(shareItemBatchSaga, {
        payload: {
          data: {
            itemIds: data.map(({ id }) => id),
            teamIds: [list.teamId],
          },
          options: {
            includeIniciator: false,
          },
        },
      });
    } else {
      yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));
    }
  } catch (error) {
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(createItemsBatchFailure());
  } finally {
    setSubmitting(false);
  }
}

export function* updateItemSaga({ payload: { item } }) {
  try {
    yield put(updateGlobalNotification(ENCRYPTING_ITEM_NOTIFICATION, true));

    const keyPair = yield select(keyPairSelector);

    const encryptedItemSecret = yield call(
      encryptItem,
      item.data,
      keyPair.publicKey,
    );

    yield call(updateItem, item.id, { item: { secret: encryptedItemSecret } });

    yield put(updateItemSuccess({ ...item, secret: encryptedItemSecret }));

    yield put(updateWorkInProgressItem());

    yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));
  } catch (error) {
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(updateItemFailure());
  }
}

export function* editItemSaga({
  payload: { item },
  meta: { setSubmitting, notification },
}) {
  try {
    const { listId, attachments, type, ...data } = item;

    const workInProgressItem = yield select(workInProgressItemSelector);
    const originalItem = yield select(itemSelector, {
      itemId: workInProgressItem.id,
    });

    const editedItemData = {
      attachments,
      ...data,
    };

    const editedItem = {
      ...originalItem,
      listId,
      data: editedItemData,
    };

    const isDataChanged = !deepequal(workInProgressItem.data, editedItemData);
    const isListIdChanged = listId !== workInProgressItem.listId;

    if (isListIdChanged) {
      yield call(moveItemSaga, { payload: { listId } });
    }

    if (isDataChanged) {
      yield call(updateItemSaga, { payload: { item: editedItem } });

      if (originalItem.invited.length) {
        yield call(updateChildItemsBatchSaga, {
          payload: { item: editedItem },
        });
      }
    }

    yield put(updateWorkInProgressItem(editedItem.id));
    yield call(notification.show, {
      text: `The '${item.name}' has been updated`,
    });
  } catch (error) {
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(editItemFailure());
  } finally {
    setSubmitting(false);
  }
}

export function* acceptItemSaga({ payload: { id } }) {
  try {
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

    const newItem = {
      ...itemData,
      secret,
      data: decryptedItemSecret,
      invited: itemData.invited.map(({ id: childId }) => childId),
    };

    yield put(acceptItemUpdateSuccess(newItem));
    yield put(updateWorkInProgressItem());
  } catch (error) {
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(acceptItemUpdateFailure(error));
  }
}

export function* rejectItemSaga({ payload: { id } }) {
  try {
    yield call(rejectUpdateItem, id);

    yield put(rejectItemUpdateSuccess(id));
    yield put(updateWorkInProgressItem());
  } catch (error) {
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(rejectItemUpdateFailure(error));
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
        role: ROLE_ANONYMOUS_USER,
      },
    });

    const encryptedSecret = yield call(
      encryptItem,
      workInProgressItem.data,
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

    const share = {
      id: items[0].id,
      userId,
      email,
      name,
      link,
      publicKey,
      isAccepted: false,
      roles: [ROLE_ANONYMOUS_USER],
    };

    yield put(createAnonymousLinkSuccess(workInProgressItem.id, share));
    yield put(updateWorkInProgressItem());
  } catch (error) {
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(createAnonymousLinkFailure());
  }
}

export function* removeAnonymousLinkSaga() {
  try {
    const workInProgressItem = yield select(workInProgressItemSelector);

    yield call(deleteChildItem, workInProgressItem.shared.id);

    yield put(removeAnonymousLinkSuccess(workInProgressItem.id));
    yield put(updateWorkInProgressItem());
  } catch (error) {
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(removeAnonymousLinkFailure());
  }
}

export default function* itemSagas() {
  yield takeLatest(REMOVE_ITEM_REQUEST, removeItemSaga);
  yield takeLatest(REMOVE_ITEMS_BATCH_REQUEST, removeItemsBatchSaga);
  yield takeLatest(MOVE_ITEM_REQUEST, moveItemSaga);
  yield takeLatest(MOVE_ITEMS_BATCH_REQUEST, moveItemsBatchSaga);
  yield takeLatest(CREATE_ITEM_REQUEST, createItemSaga);
  yield takeLatest(CREATE_ITEMS_BATCH_REQUEST, createItemsBatchSaga);
  yield takeLatest(EDIT_ITEM_REQUEST, editItemSaga);
  yield takeLatest(UPDATE_ITEM_REQUEST, updateItemSaga);
  yield takeLatest(ACCEPT_ITEM_UPDATE_REQUEST, acceptItemSaga);
  yield takeLatest(REJECT_ITEM_UPDATE_REQUEST, rejectItemSaga);
  yield takeLatest(TOGGLE_ITEM_TO_FAVORITE_REQUEST, toggleItemToFavoriteSaga);
  yield takeLatest(CREATE_ANONYMOUS_LINK_REQUEST, createAnonymousLinkSaga);
  yield takeLatest(REMOVE_ANONYMOUS_LINK_REQUEST, removeAnonymousLinkSaga);
  yield takeLatest(SHARE_ITEM_BATCH_REQUEST, shareItemBatchSaga);
  yield takeLatest(REMOVE_SHARE_REQUEST, removeShareSaga);
}
