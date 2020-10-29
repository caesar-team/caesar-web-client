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
  moveItemsBatchSuccess,
  moveItemsBatchFailure,
  removeItemSuccess,
  removeItemFailure,
  removeItemsBatchSuccess,
  removeItemsBatchFailure,
  updateItemField,
} from '@caesar/common/actions/entities/item';
import { shareItemBatchSaga } from '@caesar/common/sagas/common/share';
import {
  addItemToList,
  moveItemToList,
  moveItemsBatchToList,
  removeItemFromList,
  removeItemsBatchFromList,
} from '@caesar/common/actions/entities/list';
import { setCurrentTeamId } from '@caesar/common/actions/currentUser';
import { updateGlobalNotification } from '@caesar/common/actions/application';
import {
  setWorkInProgressItem,
  updateWorkInProgressItem,
  setWorkInProgressListId,
} from '@caesar/common/actions/workflow';
import { workInProgressItemIdsSelector } from '@caesar/common/selectors/workflow';
import {
  listSelector,
  defaultListSelector,
  currentTeamDefaultListSelector,
} from '@caesar/common/selectors/entities/list';
import { itemSelector } from '@caesar/common/selectors/entities/item';
import {
  currentTeamIdSelector,
  currentUserDataSelector,
  currentUserIdSelector,
} from '@caesar/common/selectors/currentUser';
import {
  postAddKeyPairBatch,
  postCreateItem,
  postCreateItemsBatch,
  postItemShare,
  removeItem,
  removeItemsBatch,
  toggleFavorite,
  updateItem,
  updateMoveItem,
  updateMoveItemsBatch,
} from '@caesar/common/api';
import {
  encryptItem,
  encryptItemsBatch,
} from '@caesar/common/utils/cipherUtils';
import { getServerErrorMessage } from '@caesar/common/utils/error';
import { chunk } from '@caesar/common/utils/utils';
import {
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
  shareKeyPairSelector,
  teamKeyPairSelector,
} from '@caesar/common/selectors/keystore';
import {
  convertSystemItemToKeyPair,
  generateSystemItemEmail,
  generateSystemItemName,
  isGeneralItem,
} from '@caesar/common/utils/item';
import { passwordGenerator } from '@caesar/common/utils/passwordGenerator';
import { generateKeys } from '@caesar/common/utils/key';
import { addSystemItemsBatch } from '@caesar/common/actions/entities/system';
import { userSelector } from '../../selectors/entities/user';
import {
  convertItemsToEntities,
  convertKeyPairToEntity,
} from '../../normalizers/normalizers';
import { uuid4 } from '../../utils/uuid4';

const ITEMS_CHUNK_SIZE = 50;

// TODO: move to the system item sage
export function* generateSystemItem(entityType, listId, entityId) {
  const masterPassword = yield call(passwordGenerator);
  const systemItemName = yield call(
    generateSystemItemName,
    entityType,
    entityId,
  );
  const systemItemEmail = yield call(generateSystemItemEmail, systemItemName);

  const { publicKey, privateKey } = yield call(generateKeys, masterPassword, [
    systemItemEmail,
  ]);

  const systemItemData = {
    type: entityType,
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
      password: masterPassword,
      name: systemItemName,
    },
  };

  return systemItemData;
}

export function* generateKeyPair({ name }) {
  const masterPassword = yield call(passwordGenerator);
  const systemItemName = yield call(
    generateSystemItemName,
    ITEM_TYPE.KEYPAIR,
    encodeURIComponent(name),
  );

  const systemItemEmail = yield call(generateSystemItemEmail, systemItemName);

  const { publicKey, privateKey } = yield call(generateKeys, masterPassword, [
    systemItemEmail,
  ]);

  const systemItemData = {
    type: ITEM_TYPE.KEYPAIR,
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
      password: masterPassword,
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
      // TODO: Implement remove share access
      // If user delete item all shares must be deleted
    }

    yield put(setWorkInProgressItem(null));
    yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
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
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(removeItemsBatchFailure());
  }
}

export function* toggleItemToFavoriteSaga({ payload: { item } }) {
  try {
    const {
      data: { favorite },
    } = yield call(toggleFavorite, item.id);
    yield put(updateItemField(item.id, 'favorite', favorite));
    yield put(updateWorkInProgressItem(item.id));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
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
      // TODO: Implement share access rights when moving item
    }

    if (item.teamId && teamId && item.teamId !== teamId) {
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
    console.error(error);
    yield put(moveItemFailure());
  }
}

export function* moveItemsBatchSaga({
  payload: { itemIds, oldTeamId, oldListId, teamId, listId },
  meta: { notification, notificationText } = {},
}) {
  try {
    yield put(updateGlobalNotification(COMMON_PROGRESS_NOTIFICATION, true));

    const itemIdsChunks = chunk(itemIds, ITEMS_CHUNK_SIZE);

    yield all(
      itemIdsChunks.map(itemIdsChunk =>
        call(updateMoveItemsBatch, { items: itemIdsChunk }, listId),
      ),
    );

    yield put(
      moveItemsBatchSuccess(itemIds, oldTeamId, oldListId, teamId, listId),
    );
    yield put(moveItemsBatchToList(itemIds, oldListId, listId));

    if (notification) {
      yield call(notification.show, {
        text: notificationText || 'The items have been moved',
      });
    }

    yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(moveItemsBatchFailure());
  }
}

export function* encryptSecret({ item, publicKey }) {
  const { data: { raws, ...data } = { raws: {} } } = item;

  const encryptedItemData = yield call(encryptItem, data, publicKey);

  const encryptedItem = {
    data: encryptedItemData,
    raws: Object.keys(raws).length
      ? yield call(encryptItem, raws, publicKey)
      : null,
  };

  return JSON.stringify(encryptedItem);
}

export function* saveShareKeyPairSaga({ item, publicKey }) {
  const { relatedItemId, ownerId } = item;
  const secret = yield call(encryptSecret, { item, publicKey });

  return yield call(postItemShare, {
    itemId: relatedItemId,
    users: [
      {
        userId: ownerId,
        secret,
      },
    ],
  });
}

export function* saveItemSaga({ item, publicKey }) {
  const { id = null, listId = null, type, favorite = false, ownerId } = item;

  const secret = yield call(encryptSecret, { item, publicKey });
  const title = item?.data?.name;
  let serverItemData = {};

  if (id) {
    const { data: updatedItemData } = yield call(updateItem, id, {
      secret,
      title,
    });

    serverItemData = updatedItemData || {};
  } else {
    const { data: updatedItemData } = yield call(postCreateItem, {
      listId,
      title,
      ownerId,
      type,
      favorite,
      secret,
    });

    serverItemData = updatedItemData || {};
  }

  const itemData = {
    ...item,
    ...serverItemData,
    secret,
  };
  const { itemsById } = convertItemsToEntities([itemData]);
  const normalizedItem = Object.values(itemsById).shift();

  return normalizedItem;
}

export function* getKeyPairForTeam(teamId) {
  const teamKeyPair = yield select(teamKeyPairSelector, {
    teamId,
  });

  if (teamKeyPair) {
    return teamKeyPair;
  }

  return yield select(teamKeyPairSelector, {
    teamId: TEAM_TYPE.PERSONAL,
  });
}

export function* saveKeyPair(
  { ownerId, teamId, secret, relatedItemId } = {
    teamId: null,
    relatedItemId: null,
  },
) {
  const keypairs = [{ ownerId, teamId, secret, relatedItemId }];

  return yield call(postAddKeyPairBatch, keypairs);
}

export function* saveItemKeyPair({
  item: { ownerId, teamId, data, relatedItemId },
  publicKey,
}) {
  const secret = yield call(encryptItem, data, publicKey);

  return yield call(saveKeyPair, {
    ownerId,
    teamId,
    secret,
    relatedItemId,
  });
}

export function* generateItemKeyPairKeyByName(name) {
  const generatedKeyPair = yield call(generateKeyPair, {
    name,
  });
  const keypair = {
    id: uuid4(),
    ...generatedKeyPair,
  };

  return convertSystemItemToKeyPair(keypair);
}

export function* createKeyPair({
  payload: {
    entityId = null,
    entityTeamId = null,
    publicKey,
    entityOwnerId = null,
  } = {
    entityId: null,
    entityTeamId: null,
    entityOwnerId: null,
  },
}) {
  // The deafult values
  const currentUserId = yield select(currentUserIdSelector);
  const ownerId = entityOwnerId || currentUserId;
  const teamId =
    entityTeamId !== TEAM_TYPE.PERSONAL || entityTeamId ? entityTeamId : null;

  if (!teamId && !entityId) {
    throw new Error(`The team or the related item can not be null`);
  }

  // Create an empty item
  const keypair = yield call(generateKeyPair, {
    name: entityTeamId || entityId,
  });
  const secret = yield call(encryptSecret, { item: keypair, publicKey });

  const { data: serverKeyPairItems } = yield call(saveKeyPair, {
    ownerId,
    teamId,
    secret,
    relatedItemId: entityId,
  });
  const serverKeyPairItem = Object.values(serverKeyPairItems).shift();
  const keyPairsById = convertKeyPairToEntity([
    {
      ...serverKeyPairItem,
      ...keypair,
    },
  ]);

  return keyPairsById;
}

export function* createIfNotExistKeyPair({ payload: { teamId, ownerId } }) {
  if (!teamId) return;

  const currentUser = yield select(currentUserDataSelector);
  const userId = ownerId || currentUser.id;

  const owner = yield select(userSelector, { userId });
  const { publicKey } = owner;

  const systemKeyPairItem = yield select(teamKeyPairSelector, {
    teamId,
  });

  if (!systemKeyPairItem) {
    yield call(createKeyPair, {
      payload: {
        entityId: teamId,
        entityTeamId: teamId,
        entityOwnerId: userId,
        publicKey,
      },
    });
  }
}

export function* createItemSaga({
  payload: { item },
  meta: { setSubmitting = Function.prototype },
}) {
  try {
    const { teamId = TEAM_TYPE.PERSONAL, listId } = item;

    const keyPair = yield select(teamKeyPairSelector, {
      teamId,
    });

    if (!keyPair) {
      throw new Error(`Can't find or create the key pair for the items.`);
    }

    const notificationText = !isGeneralItem(item)
      ? COMMON_PROGRESS_NOTIFICATION
      : ENCRYPTING_ITEM_NOTIFICATION;

    const { publicKey } = keyPair;

    yield put(updateGlobalNotification(notificationText, true));

    if (!publicKey) {
      // Nothing to do here
      throw new Error(
        `Can't find the publicKey in the key pair for the team ${teamId}`,
      );
    }
    const isSystemItem = !isGeneralItem(item);
    if (!isSystemItem) {
      yield put(updateGlobalNotification(CREATING_ITEM_NOTIFICATION, true));
    }

    const savedItem = yield call(saveItemSaga, { item, publicKey });
    if (!isSystemItem) {
      yield put(createItemSuccess(savedItem));
    }

    const currentTeamId = yield select(currentTeamIdSelector);

    if (
      (currentTeamId === teamId ||
        (!teamId && currentTeamId === TEAM_TYPE.PERSONAL)) &&
      !isSystemItem
    ) {
      yield put(addItemToList(savedItem));
    }

    yield put(setCurrentTeamId(teamId || TEAM_TYPE.PERSONAL));

    if (isSystemItem) {
      yield put(
        addSystemItemsBatch({
          [savedItem.id]: savedItem,
        }),
      );
    } else {
      yield put(setWorkInProgressListId(listId));
      yield put(setWorkInProgressItem(savedItem));
      yield call(Router.push, ROUTES.DASHBOARD);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
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
  payload: { items, listId, ownerId = null },
  meta: { setSubmitting },
}) {
  try {
    if (items.length <= 0) {
      throw new Error('The items list is empty');
    }

    yield put(updateGlobalNotification(ENCRYPTING_ITEM_NOTIFICATION, true));

    const currentUserId = yield select(currentUserIdSelector);
    const { teamId = TEAM_TYPE.PERSONAL } = items[0];

    yield call(createIfNotExistKeyPair, {
      payload: {
        teamId,
        ownerId: ownerId || currentUserId,
      },
    });

    const keyPair = yield select(teamKeyPairSelector, {
      teamId,
    });

    if (!keyPair) {
      throw new Error(`Can't find or create the key pair for the items.`);
    }

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

    const preparedForRequestItems = items.map(
      ({ type, name: title }, index) => ({
        type,
        listId,
        title,
        secret: JSON.stringify({
          data: encryptedItems[index],
          raws: null,
        }),
      }),
    );

    const { data: serverItems } = yield call(postCreateItemsBatch, {
      items: preparedForRequestItems,
    });

    const preparedForStoreItems = serverItems.map((item, index) => ({
      ...item,
      data: preparedForEncryptingItems[index],
    }));
    const { itemsById } = convertItemsToEntities(preparedForStoreItems);

    yield put(createItemsBatchSuccess(itemsById));
    yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(createItemsBatchFailure());
  } finally {
    setSubmitting(false);
  }
}

export function* getKeyPairForItem({ item }) {
  let keypair;

  if (item.isShared) {
    keypair = yield select(shareKeyPairSelector, { itemId: item.id });
  } else {
    let { teamId } = item;

    if (!teamId) {
      const list = yield select(listSelector, { listId: item.listId });
      teamId = list.teamId;
    }

    keypair = yield select(teamKeyPairSelector, {
      teamId: teamId || TEAM_TYPE.PERSONAL,
    });
  }

  return keypair;
}
export function* updateItemSaga({ payload: { item } }) {
  try {
    yield put(updateGlobalNotification(ENCRYPTING_ITEM_NOTIFICATION, true));

    const itemKeyPair = yield call(getKeyPairForItem, { item });
    if (!itemKeyPair?.publicKey) {
      throw new Error(`Can't get the publicKey for the item ${item.id}`);
    }

    const { publicKey } = itemKeyPair;
    const updatedItem = yield call(saveItemSaga, { item, publicKey });

    yield put(updateItemSuccess(updatedItem));
    yield put(setWorkInProgressItem(updatedItem));
    yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
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
    console.error(error);
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
