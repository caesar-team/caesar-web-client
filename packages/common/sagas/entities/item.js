import Router from 'next/router';
import { put, call, takeLatest, select, all } from 'redux-saga/effects';
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
  updateItemBatchField,
  setImportProgressPercent,
} from '@caesar/common/actions/entities/item';
import { checkIfUserWasKickedFromTeam } from '@caesar/common/sagas/currentUser';
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
import {
  itemSelector,
  itemsBatchSelector,
} from '@caesar/common/selectors/entities/item';
import {
  currentUserDataSelector,
  currentUserIdSelector,
} from '@caesar/common/selectors/currentUser';
import {
  getItemRaws,
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
  encryptData,
  encryptDataBatch,
  unsealPrivateKeyObj,
} from '@caesar/common/utils/cipherUtils';
import { getServerErrorMessage } from '@caesar/common/utils/error';
import { arrayToObject, chunk } from '@caesar/common/utils/utils';
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
  IMPORT_CHUNK_SIZE,
} from '@caesar/common/constants';
import {
  shareItemKeyPairSelector,
  shareKeyPairSelector,
  teamKeyPairSelector,
} from '@caesar/common/selectors/keystore';
import {
  convertSystemItemToKeyPair,
  createItemMetaData,
  dectyptItemAttachments,
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

    if (error.status === 403) {
      yield call(checkIfUserWasKickedFromTeam);
    }
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

    yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(removeItemsBatchFailure());

    if (error.status === 403) {
      yield call(checkIfUserWasKickedFromTeam);
    }
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

    if (error.status === 403) {
      yield call(checkIfUserWasKickedFromTeam);
    }
  }
}

export function* getItemKeyPair({
  payload: {
    item: { id: itemId, teamId, isShared },
  },
}) {
  if (isShared) {
    return yield select(shareItemKeyPairSelector, { itemId });
  }

  return yield select(teamKeyPairSelector, {
    teamId: teamId || TEAM_TYPE.PERSONAL,
  });
}

export function* downloadAndDecryptRaws({ payload: { itemId } }) {
  const { data: { raws } = { raws: {} } } = yield call(getItemRaws, itemId);
  const encryptedRaws = JSON.parse(raws);

  if (!encryptedRaws || Object.keys(encryptedRaws).length <= 0) return {};

  const item = yield select(itemSelector, { itemId });
  const keyPair = yield call(getItemKeyPair, {
    payload: {
      item,
    },
  });

  const privateKeyObj = yield Promise.resolve(
    unsealPrivateKeyObj(keyPair.privateKey, keyPair.password),
  );

  return yield call(dectyptItemAttachments, encryptedRaws, privateKeyObj);
}

export function* encryptAttachmentRaw({ id, raw }, publicKey) {
  return {
    id,
    raw: yield call(encryptData, raw, publicKey),
  };
}

export function* encryptRaws(raws, publicKey) {
  const encryptedRawsArray = yield all(
    Object.keys(raws).map(id =>
      call(encryptAttachmentRaw, { id, raw: raws[id] }, publicKey),
    ),
  );

  return arrayToObject(encryptedRawsArray);
}

export function* encryptItem({ item, publicKey }) {
  const { data: { raws, ...data } = { raws: {} } } = item;

  const encryptedItemData = yield call(encryptData, data, publicKey);
  const encryptedRaws = yield call(encryptRaws, raws, publicKey);

  const encryptedItem = {
    data: encryptedItemData,
    raws: JSON.stringify(encryptedRaws),
  };

  return encryptedItem;
}

export function* saveShareKeyPairSaga({ item, publicKey }) {
  const { relatedItemId, ownerId } = item;
  const { data, raws } = yield call(encryptItem, { item, publicKey });

  return yield call(postItemShare, {
    itemId: relatedItemId,
    users: [
      {
        userId: ownerId,
        secret: JSON.stringify({ data, raws }),
      },
    ],
  });
}

export function* saveItemSaga({ item, publicKey }) {
  const { id = null, listId = null, type, favorite = false, ownerId } = item;
  const itemFromStore = yield select(itemSelector, { itemId: item.id });

  if (!item?.data || !itemFromStore?.data) {
    // TODO: Need to get data here
    // yield call(decryptItem, item);
  }

  let isRawsChanged = isGeneralItem(item);
  let itemToEncrypt = item;

  if (
    !!itemFromStore &&
    deepequal(itemFromStore.data?.attachments, item.data?.attachments)
  ) {
    isRawsChanged = false;
  }

  if (isRawsChanged && isGeneralItem(item)) {
    const rawsFromServer = id
      ? yield call(downloadAndDecryptRaws, {
          payload: { itemId: item.id },
        })
      : {};

    itemToEncrypt = {
      // OMG :(
      ...item,
      data: {
        ...item.data,
        raws: {
          ...(item.data?.raws || {}),
          ...(rawsFromServer || {}),
        },
      },
    };
  }

  const { data, raws } = yield call(encryptItem, {
    item: itemToEncrypt,
    publicKey,
  });

  let serverItemData = {};
  let secretDataAndRaws = {};

  if (isRawsChanged) {
    // we need to save the raws to the item
    secretDataAndRaws = {
      secret: isGeneralItem(item) // save the raws inside the item if it's a non-general item
        ? JSON.stringify({ data })
        : JSON.stringify({ data, raws }),
      raws: isGeneralItem(item) ? raws : null,
    };
  } else {
    secretDataAndRaws = {
      secret: isGeneralItem(item)
        ? JSON.stringify({ data })
        : JSON.stringify({ data, raws }),
    };
  }

  if (id) {
    const { data: updatedItemData } = yield call(updateItem, id, {
      meta: createItemMetaData(item),
      ...secretDataAndRaws,
    });

    serverItemData = updatedItemData || {};
  } else {
    const { data: updatedItemData } = yield call(postCreateItem, {
      listId,
      meta: createItemMetaData(item),
      ownerId,
      type,
      favorite,
      ...secretDataAndRaws,
    });

    serverItemData = updatedItemData || {};
  }

  let itemData = null;

  if (isGeneralItem(item)) {
    itemData = {
      ...item,
      ...serverItemData,
      secret: JSON.stringify({ data }),
    };
  } else {
    itemData = {
      ...item,
      ...serverItemData,
      secret: JSON.stringify({ data }),
      raws,
    };
  }

  const { itemsById } = convertItemsToEntities([itemData]);
  const normalizedItem = Object.values(itemsById).shift();

  return normalizedItem;
}

export function* moveItemSaga({
  payload: { itemId, teamId, listId },
  meta: { notification, notificationText } = {},
}) {
  try {
    yield put(updateGlobalNotification(MOVING_IN_PROGRESS_NOTIFICATION, true));

    const list = yield select(listSelector, { listId });

    // TODO: Change selector to just team default list selector
    // Also TODO: Add such logic into moveBatch
    const defaultList = teamId
      ? yield select(currentTeamDefaultListSelector)
      : yield select(defaultListSelector);

    const newListId = list ? listId : defaultList?.id;

    const item = yield select(itemSelector, { itemId });

    yield call(updateMoveItem, item.id, {
      listId: newListId,
    });

    if (item.teamId !== teamId) {
      yield put(updateItemField(item.id, 'teamId', teamId));

      const keyPair = yield select(teamKeyPairSelector, {
        teamId,
      });

      if (!keyPair) {
        throw new Error(`Can't find or create the key pair for the items.`);
      }

      const { publicKey } = keyPair;

      if (!publicKey) {
        // Nothing to do here
        throw new Error(
          `Can't find the publicKey in the key pair for the team ${teamId}`,
        );
      }

      yield call(saveItemSaga, { item, publicKey });
    }

    yield put(moveItemSuccess(item.id, item.listId, newListId));
    yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));

    if (notification) {
      yield call(notification.show, {
        text: notificationText || `The '${item.meta.title}' has been moved`,
      });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(moveItemFailure());

    if (error.status === 403) {
      yield call(checkIfUserWasKickedFromTeam);
    }
  }
}

export function* moveItemsBatchSaga({
  payload: { itemIds, oldTeamId, oldListId, teamId, listId },
  meta: { notification, notificationText } = {},
}) {
  try {
    yield put(updateGlobalNotification(MOVING_IN_PROGRESS_NOTIFICATION, true));

    const itemIdsChunks = chunk(itemIds, ITEMS_CHUNK_SIZE);

    yield all(
      itemIdsChunks.map(itemIdsChunk =>
        call(updateMoveItemsBatch, { items: itemIdsChunk }, listId),
      ),
    );

    if (oldTeamId !== teamId) {
      yield put(updateItemBatchField(itemIds, 'teamId', teamId));

      const keyPair = yield select(teamKeyPairSelector, {
        teamId,
      });

      if (!keyPair) {
        throw new Error(`Can't find or create the key pair for the items.`);
      }

      const { publicKey } = keyPair;

      if (!publicKey) {
        // Nothing to do here
        throw new Error(
          `Can't find the publicKey in the key pair for the team ${teamId}`,
        );
      }

      const items = yield select(itemsBatchSelector, { itemIds });

      yield all(items.map(item => call(saveItemSaga, { item, publicKey })));
    }

    yield put(
      moveItemsBatchSuccess(itemIds, oldTeamId, oldListId, teamId, listId),
    );
    yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));

    if (notification) {
      yield call(notification.show, {
        text: notificationText || 'The items have been moved',
      });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(moveItemsBatchFailure());

    if (error.status === 403) {
      yield call(checkIfUserWasKickedFromTeam);
    }
  }
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
  { ownerId, teamId, secret, raws, relatedItemId } = {
    teamId: null,
    relatedItemId: null,
  },
) {
  const keypairs = [{ ownerId, teamId, secret, raws, relatedItemId }];

  return yield call(postAddKeyPairBatch, keypairs);
}

export function* saveItemKeyPair({
  item: { ownerId, teamId, data, relatedItemId },
  publicKey,
}) {
  const { data: secretData, raws } = yield call(encryptData, data, publicKey);

  return yield call(saveKeyPair, {
    ownerId,
    teamId,
    secret: JSON.stringify({ data: secretData, raws }),
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
  const { data, raws } = yield call(encryptItem, {
    item: keypair,
    publicKey,
  });

  const { data: serverKeyPairItems } = yield call(saveKeyPair, {
    ownerId,
    teamId,
    secret: JSON.stringify({ data, raws }),
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

    if (error.status === 403) {
      yield call(checkIfUserWasKickedFromTeam);
    }
  } finally {
    yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));
    setSubmitting(false);
  }
}

function* postCreateItemsChunk({ totalCount, items, keyPair, listId }) {
  const preparedForEncryptingItems = items.map(
    ({ attachments, type, ...data }) => ({
      attachments,
      ...data,
    }),
  );

  const encryptedItems = yield call(
    encryptDataBatch,
    preparedForEncryptingItems,
    keyPair.publicKey,
  );

  const preparedForRequestItems = items.map(({ type, ...data }, index) => ({
    type,
    listId,
    meta: createItemMetaData({ data }),
    secret: JSON.stringify({
      data: encryptedItems[index],
    }),
  }));

  const { data: serverItems } = yield call(postCreateItemsBatch, {
    items: preparedForRequestItems,
  });

  const preparedForStoreItems = serverItems.map((item, index) => ({
    ...item,
    data: preparedForEncryptingItems[index],
  }));
  const { itemsById } = convertItemsToEntities(preparedForStoreItems);

  yield put(setImportProgressPercent(items.length / totalCount));
  yield put(createItemsBatchSuccess(itemsById));
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

    const itemsChunks = chunk(items, IMPORT_CHUNK_SIZE);
    yield all(
      itemsChunks.map(itemChunk =>
        call(postCreateItemsChunk, {
          totalCount: items.length,
          items: itemChunk,
          keyPair,
          listId,
        }),
      ),
    );

    yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(createItemsBatchFailure());

    if (error.status === 403) {
      yield call(checkIfUserWasKickedFromTeam);
    }
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

    if (error.status === 403) {
      yield call(checkIfUserWasKickedFromTeam);
    }
  }
}

export function* editItemSaga({
  payload: { itemId, patch },
  meta: { setSubmitting, notification },
}) {
  try {
    const item = yield select(itemSelector, { itemId });
    if (!item) {
      throw new Error(`Can't find the item ${itemId}`);
    }

    const patchedItem = {
      ...item,
      data: {
        ...item.data,
        ...patch,
      },
    };
    const {
      listId,
      data: { raws, ...data },
    } = patchedItem;

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
      yield call(updateItemSaga, {
        payload: {
          item: patchedItem,
        },
      });
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

    if (error.status === 403) {
      yield call(checkIfUserWasKickedFromTeam);
    }
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
