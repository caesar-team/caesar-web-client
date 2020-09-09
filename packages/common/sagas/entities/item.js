import Router from 'next/router';
import { put, call, takeLatest, select, fork, all } from 'redux-saga/effects';
import deepequal from 'fast-deep-equal';
import {
  CREATE_ITEM_REQUEST,
  CREATE_ITEMS_BATCH_REQUEST,
  EDIT_ITEM_REQUEST,
  UPDATE_ITEM_REQUEST,
  MOVE_ITEM_REQUEST,
  MOVE_ITEMS_BATCH_REQUEST,
  REMOVE_ITEM_REQUEST,
  REMOVE_ITEMS_BATCH_REQUEST,
  TOGGLE_ITEM_TO_FAVORITE_REQUEST,
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
  removeItemSuccess,
  removeItemFailure,
  removeItemsBatchSuccess,
  removeItemsBatchFailure,
  toggleItemToFavoriteSuccess,
  toggleItemToFavoriteFailure,
  removeChildItemsBatchFromItem,
  updateItemField,
  createItemRequest,
} from '@caesar/common/actions/entities/item';
import { shareItemBatchSaga } from '@caesar/common/sagas/common/share';
import {
  addItemToList,
  addItemsBatchToList,
  moveItemToList,
  removeItemFromList,
  removeItemsBatchFromList,
  toggleItemToFavoriteList,
} from '@caesar/common/actions/entities/list';
import { removeChildItemsBatch } from '@caesar/common/actions/entities/childItem';
import { setCurrentTeamId } from '@caesar/common/actions/user';
import { updateGlobalNotification } from '@caesar/common/actions/application';
import {
  setWorkInProgressItem,
  updateWorkInProgressItem,
  setWorkInProgressListId,
} from '@caesar/common/actions/workflow';
import { workInProgressItemIdsSelector } from '@caesar/common/selectors/workflow';
import {
  listSelector,
  favoriteListSelector,
  currentTeamFavoriteListSelector,
  defaultListSelector,
  currentTeamDefaultListSelector,
} from '@caesar/common/selectors/entities/list';
import { itemSelector } from '@caesar/common/selectors/entities/item';
import {
  currentTeamIdSelector,
  userPersonalDefaultListIdSelector,
} from '@caesar/common/selectors/user';
import {
  addShareKeyPair,
  addTeamKeyPair,
} from '@caesar/common/actions/keyStore';
import {
  postCreateItem,
  postCreateItemsBatch,
  removeItem,
  removeItemsBatch,
  toggleFavorite,
  updateItem,
  updateMoveItem,
} from '@caesar/common/api';
import {
  encryptItem,
  encryptItemsBatch,
} from '@caesar/common/utils/cipherUtils';
import { getServerErrorMessage } from '@caesar/common/utils/error';
import { chunk } from '@caesar/common/utils/utils';
import {
  ENTITY_TYPE,
  COMMON_PROGRESS_NOTIFICATION,
  CREATING_ITEM_NOTIFICATION,
  ENCRYPTING_ITEM_NOTIFICATION,
  MOVING_IN_PROGRESS_NOTIFICATION,
  REMOVING_IN_PROGRESS_NOTIFICATION,
  NOOP_NOTIFICATION,
  ROUTES,
  TEAM_TYPE,
  ITEM_TYPE,
} from '@caesar/common/constants';
import {
  personalKeyPairSelector,
  teamKeyPairSelector,
} from '@caesar/common/selectors/keyStore';
import {
  generateSystemItemEmail,
  generateSystemItemName,
} from '@caesar/common/utils/item';
import { passwordGenerator } from '@caesar/common/utils/passwordGenerator';
import { generateKeys } from '@caesar/common/utils/key';
import { addSystemItemsBatch } from '@caesar/common/actions/entities/system';

const ITEMS_CHUNK_SIZE = 50;

export function* generateSystemItem(entity, listId, entityId) {
  const masterPassword = yield call(passwordGenerator);
  const systemItemName = yield call(generateSystemItemName, entity, entityId);
  const systemItemEmail = yield call(generateSystemItemEmail, systemItemName);

  const { publicKey, privateKey } = yield call(generateKeys, masterPassword, [
    systemItemEmail,
  ]);

  const systemItemData = {
    type: ITEM_TYPE.SYSTEM,
    listId,
    data: {
      attachments: [
        {
          id: 'publicKey',
          name: 'publicKey',
        },
        {
          id: 'privateKey',
          name: 'privateKey',
        },
      ],
      raws: {
        privateKey,
        publicKey,
      },
      pass: masterPassword,
      name: systemItemName,
    },
  };

  return systemItemData;
}

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
    // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-console
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(removeItemsBatchFailure());
  }
}

export function* toggleItemToFavoriteSaga({ payload: { item } }) {
  try {
    const favoritesList = item.teamId
      ? yield select(currentTeamFavoriteListSelector)
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
    // eslint-disable-next-line no-console
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(toggleItemToFavoriteFailure());
  }
}

export function* moveItemSaga({
  payload: { itemId, teamId, listId },
  meta: { notification, notificationText } = {},
}) {
  try {
    yield put(updateGlobalNotification(MOVING_IN_PROGRESS_NOTIFICATION, true));

    const list = yield select(listSelector, { listId });

    const defaultList = teamId
      ? yield select(currentTeamDefaultListSelector)
      : yield select(defaultListSelector);

    const newListId = list ? listId : defaultList?.id;

    const item = yield select(itemSelector, { itemId });
    const childItemIds = item.invited;

    yield call(updateMoveItem, item.id, {
      listId: newListId,
    });
    yield put(moveItemSuccess(item.id, item.listId, newListId));
    yield put(moveItemToList(item.id, item.listId, newListId));

    yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));

    if (notification) {
      yield call(notification.show, {
        text: notificationText || `The '${item.data.name}' has been moved`,
      });
    }

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
    // eslint-disable-next-line no-console
    console.log(error);
    yield put(moveItemFailure());
  }
}

export function* moveItemsBatchSaga({
  payload: { itemIds, teamId, listId },
  meta: { notification, notificationText } = {},
}) {
  try {
    yield all(
      itemIds.map(itemId =>
        call(moveItemSaga, { payload: { itemId, teamId, listId } }),
      ),
    );

    if (notification) {
      yield call(notification.show, {
        text: notificationText || 'The items have been moved',
      });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(moveItemsBatchFailure());
  }
}

export function* createItemSaga({
  payload: { item },
  meta: { setSubmitting = Function.prototype },
}) {
  try {
    const {
      teamId = null,
      listId,
      type,
      relatedItem = null,
      data: { raws = {}, ...data },
    } = item;

    const isSystemItem = type === ITEM_TYPE.SYSTEM;
    const keyPair = yield select(personalKeyPairSelector);
    const userPersonalDefaultListId = yield select(
      userPersonalDefaultListIdSelector,
    );
    const notificationText = isSystemItem
      ? COMMON_PROGRESS_NOTIFICATION
      : ENCRYPTING_ITEM_NOTIFICATION;
    let { publicKey } = keyPair;

    yield put(updateGlobalNotification(notificationText, true));

    if (teamId) {
      const teamSystemItem = yield select(teamKeyPairSelector, {
        teamId,
      });
      publicKey = teamSystemItem.publicKey;
    }

    const encryptedItemData = yield call(encryptItem, data, publicKey);

    const encryptedItem = {
      data: encryptedItemData,
      raws: Object.keys(raws).length
        ? yield call(encryptItem, raws, publicKey)
        : null,
    };

    if (!isSystemItem) {
      yield put(updateGlobalNotification(CREATING_ITEM_NOTIFICATION, true));
    }

    const { data: itemData } = yield call(postCreateItem, {
      listId,
      type,
      secret: JSON.stringify(encryptedItem),
      relatedItem,
    });

    // TODO: Make the class of the item instead of the direct object
    const newItem = {
      ...item,
      ...itemData,
    };

    if (!isSystemItem) {
      yield put(createItemSuccess(newItem));
    }

    const currentTeamId = yield select(currentTeamIdSelector);

    if (
      (currentTeamId === teamId ||
        (!teamId && currentTeamId === TEAM_TYPE.PERSONAL)) &&
      !isSystemItem
    ) {
      yield put(addItemToList(newItem));
    }

    yield put(setCurrentTeamId(teamId || TEAM_TYPE.PERSONAL));

    if (isSystemItem) {
      console.log(isSystemItem);
      yield put(
        addSystemItemsBatch({
          [newItem.id]: newItem,
        }),
      );
      if (data.name.includes(ENTITY_TYPE.TEAM)) {
        yield put(addTeamKeyPair(newItem));
      } else {
        yield put(addShareKeyPair(newItem));
      }
    } else {
      yield put(setWorkInProgressListId(listId));
      yield put(setWorkInProgressItem(newItem));
      yield call(Router.push, ROUTES.DASHBOARD);
    }
    // TODO: Remove the commeted lines before merge.
    // if (!isSystemItem) {
    //   if (!teamId && currentTeamId === TEAM_TYPE.PERSONAL) {
    //     const systemItemData = yield call(
    //       generateSystemItem,
    //       ENTITY_TYPE.SHARE,
    //       userPersonalDefaultListId,
    //       itemData.id,
    //     );
    //     systemItemData.relatedItem = itemData.id;

    //     yield put(createItemRequest(systemItemData));
    //   }
    // }
  } catch (error) {
    // eslint-disable-next-line no-console
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
// TODO: Need to be updated to the sepated raws feature
export function* createItemsBatchSaga({
  payload: { items, listId },
  meta: { setSubmitting },
}) {
  try {
    yield put(updateGlobalNotification(ENCRYPTING_ITEM_NOTIFICATION, true));

    const list = yield select(listSelector, { listId });
    const keyPair = yield select(personalKeyPairSelector);

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
      secret: JSON.stringify({
        data: encryptedItems[index],
        raws: null,
      }),
    }));

    const { data } = yield call(postCreateItemsBatch, {
      items: preparedForRequestItems,
    });

    const preparedForStoreItems = data.map((item, index) => ({
      ...item,
      data: preparedForEncryptingItems[index],
    }));

    yield put(createItemsBatchSuccess(preparedForStoreItems));
    yield put(addItemsBatchToList(data.map(({ id }) => id), listId));
    yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));

    if (list.teamId) {
      // TODO: [Import] create system items for team
      // yield fork(shareItemBatchSaga, {
      //   payload: {
      //     data: {
      //       itemIds: data.map(({ id }) => id),
      //       teamIds: [list.teamId],
      //     },
      //     options: {
      //       includeIniciator: false,
      //     },
      //   },
      // });
    } else {
      yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));
    }
  } catch (error) {
    // eslint-disable-next-line no-console
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
    const {
      id: itemId,
      data: { raws, ...data },
    } = item;

    yield put(updateGlobalNotification(ENCRYPTING_ITEM_NOTIFICATION, true));

    const keyPair = yield select(personalKeyPairSelector);

    const encryptedItemData = yield call(encryptItem, data, keyPair.publicKey);
    const encryptedItem = {
      data: encryptedItemData,
      raws: Object.keys(raws).length
        ? yield call(encryptItem, raws, keyPair.publicKey)
        : null,
    };

    const encryptedItemSecret = JSON.stringify(encryptedItem);

    const {
      data: { lastUpdated },
    } = yield call(updateItem, itemId, {
      item: { secret: encryptedItemSecret },
    });
    const updatedItem = {
      ...item,
      lastUpdated,
      secret: encryptedItemSecret,
    };
    yield put(updateItemSuccess(updatedItem));

    yield put(updateWorkInProgressItem());
    yield put(setWorkInProgressItem(updatedItem));
    yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));
  } catch (error) {
    // eslint-disable-next-line no-console
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
    const {
      id: itemId,
      listId,
      data: { raws, ...data },
    } = item;

    const itemInState = yield select(itemSelector, { itemId });
    const isDataChanged = !deepequal(itemInState.data, data);

    if (!isDataChanged) {
      setSubmitting(false);
      yield put(
        updateGlobalNotification(
          `The '${item.data.name}' has not been updated`,
          false,
          true,
        ),
      );

      return;
    }

    const isListIdChanged = listId !== itemInState.listId;

    if (isListIdChanged) {
      yield call(moveItemSaga, { payload: { listId } });
    }

    if (isDataChanged) {
      yield call(updateItemSaga, { payload: { item } });
    }

    yield put(updateWorkInProgressItem(item.id));
    yield call(notification.show, {
      text: `The '${item.data.name}' has been updated`,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(editItemFailure());
  } finally {
    setSubmitting(false);
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
  yield takeLatest(TOGGLE_ITEM_TO_FAVORITE_REQUEST, toggleItemToFavoriteSaga);
}
