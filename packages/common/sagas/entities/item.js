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
} from '@caesar/common/actions/entities/item';
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
import { updateChildItemsBatchSaga } from '@caesar/common/sagas/entities/childItem';
import { shareItemBatchSaga } from '@caesar/common/sagas/common/share';
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
  listSelector,
  favoriteListSelector,
  currentTeamFavoriteListSelector,
  defaultListSelector,
  currentTeamDefaultListSelector,
} from '@caesar/common/selectors/entities/list';
import { itemSelector } from '@caesar/common/selectors/entities/item';
import {
  userDataSelector,
  currentTeamIdSelector,
} from '@caesar/common/selectors/user';
import { addTeamKeyPair } from '@caesar/common/actions/keyStore';
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
  CREATING_ITEMS_NOTIFICATION,
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
  meta: { setSubmitting = Function.prototype },
}) {
  try {
    const { teamId, listId, attachments, type, ...data } = item;
    const isSystemItem = type === ITEM_TYPE.SYSTEM;
    const keyPair = yield select(personalKeyPairSelector);
    const user = yield select(userDataSelector);
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

    const encryptedItem = yield call(
      encryptItem,
      { attachments, ...data },
      publicKey,
    );

    if (!isSystemItem) {
      yield put(updateGlobalNotification(CREATING_ITEM_NOTIFICATION, true));
    }

    const {
      data: { id: itemId, lastUpdated, invited, _links },
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
      invited: invited || [],
      shared: null,
      tags: [],
      teamId: teamId || null,
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

    yield put(setCurrentTeamId(teamId || TEAM_TYPE.PERSONAL));

    if (isSystemItem) {
      yield put(addTeamKeyPair(newItem));
    } else {
      yield put(setWorkInProgressListId(listId));
      yield put(setWorkInProgressItem(newItem));
      yield call(Router.push, ROUTES.DASHBOARD);
    }
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
    const keyPair = yield select(personalKeyPairSelector);
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

    const keyPair = yield select(personalKeyPairSelector);

    const encryptedItemSecret = yield call(
      encryptItem,
      item.data,
      keyPair.publicKey,
    );

    const {
      data: { lastUpdated },
    } = yield call(updateItem, item.id, {
      item: { secret: encryptedItemSecret },
    });

    yield put(
      updateItemSuccess({ ...item, lastUpdated, secret: encryptedItemSecret }),
    );

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
