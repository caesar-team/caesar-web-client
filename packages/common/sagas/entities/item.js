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
  removeChildItemsBatchFromItem,
  updateItemField,
} from '@caesar/common/actions/entities/item';
import { shareItemBatchSaga } from '@caesar/common/sagas/common/share';
import {
  addItemToList,
  addItemsBatchToList,
  moveItemToList,
  moveItemsBatchToList,
  removeItemFromList,
  removeItemsBatchFromList,
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
  defaultListSelector,
  currentTeamDefaultListSelector,
  teamDefaultListSelector,
} from '@caesar/common/selectors/entities/list';
import { itemSelector } from '@caesar/common/selectors/entities/item';
import {
  currentTeamIdSelector,
  userDataSelector,
  userIdSelector,
} from '@caesar/common/selectors/user';
import {
  addShareKeyPair,
  addTeamKeyPair,
  addTeamKeyPairBatch,
} from '@caesar/common/actions/keystore';
import {
  postCreateItem,
  postCreateItemsBatch,
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
import { createPermissionsFromLinks } from '@caesar/common/utils/createPermissionsFromLinks';
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
import { teamKeyPairSelector } from '@caesar/common/selectors/keystore';
import {
  generateSystemItemEmail,
  generateSystemItemName,
  isGeneralItem,
} from '@caesar/common/utils/item';
import { passwordGenerator } from '@caesar/common/utils/passwordGenerator';
import { generateKeys } from '@caesar/common/utils/key';
import { addSystemItemsBatch } from '@caesar/common/actions/entities/system';
import { memberSelector } from '../../selectors/entities/member';

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
      pass: masterPassword,
      name: systemItemName,
    },
  };

  return systemItemData;
}

export function* generateTeamKeyPair({ name }) {
  const masterPassword = yield call(passwordGenerator);
  const systemItemName = yield call(
    generateSystemItemName,
    ITEM_TYPE.KEYPAIR,
    name,
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
    yield call(toggleFavorite, item.id);
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

export function* saveItemSaga({ item, publicKey }) {
  const {
    id = null,
    listId,
    type,
    favorite = false,
    relatedItemId = null,
  } = item;

  const secret = yield call(encryptSecret, { item, publicKey });

  let serverItemData = {};

  if (id) {
    const { data: updatedItemData } = yield call(updateItem, id, { secret });

    serverItemData = updatedItemData || {};
  } else {
    const { data: updatedItemData } = yield call(postCreateItem, {
      listId,
      type,
      favorite,
      secret,
      relatedItemId,
    });

    serverItemData = updatedItemData || {};
  }

  const itemData = {
    ...item,
    ...serverItemData,
    teamId: item.teamId || TEAM_TYPE.PERSONAL,
    _permissions: createPermissionsFromLinks(serverItemData._links) || {},
    secret,
  };

  return itemData;
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

export function* createSystemItemKeyPair({
  payload: {
    entityId,
    entityTeamId,
    entityType,
    publicKey,
    entityOwnerId = null,
  },
}) {
  // The deafult values
  const teamId = entityTeamId || TEAM_TYPE.PERSONAL;
  const currentUserId = yield select(userIdSelector);
  const ownerId = entityOwnerId || currentUserId;

  const { id: defaultListId } = yield select(teamDefaultListSelector, {
    teamId,
  });

  if (!entityType) {
    throw new Error(`The type of system item isn't defined`);
  }

  // Create an empty item
  let systemKeyPairItem = yield call(
    generateSystemItem,
    entityType,
    defaultListId,
    entityId,
  );

  // If the keypair for the shared item
  if (ENTITY_TYPE.SHARE === entityType) {
    systemKeyPairItem.relatedItemId = entityId;
  } else if (ENTITY_TYPE.TEAM === entityType) {
    systemKeyPairItem.ownerId = ownerId;
  }

  if (teamId !== TEAM_TYPE.PERSONAL) {
    systemKeyPairItem.teamId = teamId;
  }

  // Encrypt and save the system keypair item to the owner personal vault
  const systemItemFromServer = yield call(saveItemSaga, {
    item: {
      ...systemKeyPairItem,
      type: ITEM_TYPE.KEYPAIR,
    },
    publicKey,
  });

  systemKeyPairItem = {
    ...systemKeyPairItem,
    ...systemItemFromServer,
  };

  yield put(
    addTeamKeyPairBatch({
      [systemKeyPairItem.id]: systemKeyPairItem,
    }),
  );

  return systemKeyPairItem;
}

export function* createIfNotExistKeyPair({ payload: { teamId, ownerId } }) {
  if (!teamId) return;
  const currentUser = yield select(userDataSelector);
  const userId = ownerId || currentUser.id;

  const owner = yield select(memberSelector, { memberId: userId });
  const { publicKey } = owner;

  const systemKeyPairItem = yield select(teamKeyPairSelector, {
    teamId,
  });

  if (!systemKeyPairItem) {
    yield call(createSystemItemKeyPair, {
      payload: {
        entityId: teamId,
        entityTeamId: teamId,
        entityType: ENTITY_TYPE.TEAM,
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
    const currentUserId = yield select(userIdSelector);
    const {
      teamId = TEAM_TYPE.PERSONAL,
      ownerId = currentUserId,
      listId,
      data,
    } = item;

    yield call(createIfNotExistKeyPair, {
      payload: {
        teamId,
        ownerId,
      },
    });

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

    const itemFromServer = yield call(saveItemSaga, { item, publicKey });

    // TODO: Make the class of the item instead of the direct object
    const newItem = {
      ...item,
      ...itemFromServer,
      _permissions: createPermissionsFromLinks(itemFromServer._links),
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

    const userId = yield select(userIdSelector);
    const { teamId } = items[0];

    yield call(createIfNotExistKeyPair, {
      payload: {
        teamId,
        ownerId: ownerId || userId,
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

export function* updateItemSaga({ payload: { item } }) {
  try {
    yield put(updateGlobalNotification(ENCRYPTING_ITEM_NOTIFICATION, true));

    const list = yield select(listSelector, { listId: item.listId });

    const { publicKey } = yield select(teamKeyPairSelector, {
      teamId: list.teamId || TEAM_TYPE.PERSONAL,
    });

    if (!publicKey) {
      throw new Error(
        `Can't get the publicKey for the item ${item.id} and the list ${list.id}`,
      );
    }

    const updatedItem = yield call(saveItemSaga, { item, publicKey });

    yield put(updateItemSuccess(updatedItem));

    yield put(updateWorkInProgressItem());
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
