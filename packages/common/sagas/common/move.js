import { put, call, takeLatest, select, all } from 'redux-saga/effects';
import {
  MOVE_ITEM_REQUEST,
  MOVE_ITEMS_BATCH_REQUEST,
  moveItemSuccess,
  moveItemFailure,
  moveItemsBatchSuccess,
  moveItemsBatchFailure,
} from '@caesar/common/actions/entities/item';
import { checkIfUserWasKickedFromTeam } from '@caesar/common/sagas/currentUser';
import { updateGlobalNotification } from '@caesar/common/actions/application';
import {
  listSelector,
  currentTeamDefaultListSelector,
} from '@caesar/common/selectors/entities/list';
import {
  itemSelector,
  itemsBatchSelector,
} from '@caesar/common/selectors/entities/item';
import {
  moveItem,
  moveTeamItem,
  moveItemsBatch,
  moveTeamItemsBatch,
} from '@caesar/common/api';
import { getServerErrorMessage } from '@caesar/common/utils/error';
import { chunk } from '@caesar/common/utils/utils';
import {
  MOVING_IN_PROGRESS_NOTIFICATION,
  NOOP_NOTIFICATION,
  TEAM_TYPE,
  ITEM_TEXT_TYPE,
  ENCRYPTION_CHUNK_SIZE,
} from '@caesar/common/constants';
import {
  shareItemKeyPairSelector,
  teamKeyPairSelector,
} from '@caesar/common/selectors/keystore';
import { updateShareKeyPairBatch } from '@caesar/common/actions/keystore';
import { reencryptItemSecretSaga, decryptItemSync } from '../entities/item';
import { convertKeyPairToItemEntity } from '../../normalizers/normalizers';

function* getPublicKeyToEncrypt(teamId) {
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
      `Can't find the publicKey in the key pair for the team ${teamId}.`,
    );
  }

  return publicKey;
}

const callMoveItemRoute = (item, dataPayload, isPersonal) =>
  isPersonal
    ? moveItem(item.id, dataPayload)
    : moveTeamItem(item.teamId, item.id, dataPayload);

const callMoveItemBatchRoute = (listId, payload, isPersonal, oldTeamId) =>
  isPersonal
    ? moveItemsBatch(listId, payload)
    : moveTeamItemsBatch(oldTeamId, listId, payload);

export function* moveItemSaga({
  payload: { itemId, teamId, listId, teamDefaultListId },
  meta: { notification, notificationText } = {},
}) {
  try {
    yield put(updateGlobalNotification(MOVING_IN_PROGRESS_NOTIFICATION, true));

    const item = yield select(itemSelector, { itemId });
    const list = yield select(listSelector, { listId });
    const defaultList = yield select(currentTeamDefaultListSelector);
    // newListId is using to restore item from trash and when original list was deleted
    const newListId =
      item.teamId === teamId && !list ? defaultList?.id : listId;
    const currentIsPersonal =
      !item.teamId || item.teamId === TEAM_TYPE.PERSONAL;
    const newIsPersonal = !teamId || teamId === TEAM_TYPE.PERSONAL;

    let reencryptedData = null;
    let reencryptedSecretDataAndRaws = null;

    let itemToReencrypt = item;

    if (item.teamId !== teamId) {
      // We must reencrypt item or shared keypair if we move item between vaults
      if (!item.data) {
        // TODO: Decrypt item here
      }

      const publicKey = yield call(getPublicKeyToEncrypt, teamId);

      if (item.isShared) {
        const sharedItemKeyPairKey = yield select(shareItemKeyPairSelector, {
          itemId: item.id,
        });

        itemToReencrypt = {
          id: sharedItemKeyPairKey.id,
          teamId: sharedItemKeyPairKey.teamId,
          ...Object.values(
            convertKeyPairToItemEntity([sharedItemKeyPairKey]),
          ).shift(),
        };
      }

      const { data, secretDataAndRaws } = yield call(reencryptItemSecretSaga, {
        item: itemToReencrypt,
        publicKey,
        updateRawsCertainly: !item.isShared,
      });

      reencryptedData = data || {};
      reencryptedSecretDataAndRaws = secretDataAndRaws || {};
    }

    if (item.teamId !== teamId && item.isShared) {
      const sharedPayload = {
        listId: teamDefaultListId,
        ...reencryptedSecretDataAndRaws,
      };

      // Move item into another list
      yield call(
        callMoveItemRoute,
        { id: item.id, teamId: item.teamId },
        { listId: newListId },
        currentIsPersonal,
      );
      // Reencrypt shared keypair with team keypair instead personal
      // Move shared keypair into default list of the vault
      yield call(
        callMoveItemRoute,
        { id: itemToReencrypt.id, teamId: itemToReencrypt.teamId },
        sharedPayload,
        currentIsPersonal,
      );

      yield put(
        moveItemSuccess({
          itemId: item.id,
          previousListId: item.listId,
          listId: newIsPersonal ? newListId : null,
          teamListId: newIsPersonal ? null : newListId,
          teamId,
        }),
      );
      yield put(
        updateShareKeyPairBatch({
          updatedShareKeyPairs: [
            {
              relatedItemId: item.id,
              teamId,
            },
          ],
        }),
      );
    } else {
      const dataPayload = reencryptedSecretDataAndRaws
        ? {
            listId: newListId,
            ...reencryptedSecretDataAndRaws,
          }
        : { listId: newListId };

      yield call(callMoveItemRoute, item, dataPayload, currentIsPersonal);

      yield put(
        moveItemSuccess({
          itemId: item.id,
          previousListId: item.listId,
          listId: newIsPersonal ? newListId : null,
          teamListId: newIsPersonal ? null : newListId,
          teamId,
          secret: reencryptedData
            ? JSON.stringify({ data: reencryptedData })
            : item.secret,
        }),
      );
    }

    yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));

    if (notification) {
      yield call(notification.show, {
        text: notificationText ||
          `The ${ITEM_TEXT_TYPE[item.type]} '${item.meta.title}' has been moved`,
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

function* reencryptSharedKeypair(item, publicKey) {
  const sharedItemKeyPairKey = yield select(shareItemKeyPairSelector, {
    itemId: item.id,
  });

  const itemToReencrypt = {
    id: sharedItemKeyPairKey.id,
    ...Object.values(
      convertKeyPairToItemEntity([sharedItemKeyPairKey]),
    ).shift(),
  };

  const { secretDataAndRaws } = yield call(reencryptItemSecretSaga, {
    item: itemToReencrypt,
    publicKey,
  });

  return {
    id: sharedItemKeyPairKey.id,
    ...secretDataAndRaws,
  };
}

export function* moveItemsBatchSaga({
  payload: {
    itemIds,
    oldTeamId,
    previousListId,
    teamId,
    listId,
    teamDefaultListId,
  },
  meta: { notification, notificationText } = {},
}) {
  try {
    yield put(updateGlobalNotification(MOVING_IN_PROGRESS_NOTIFICATION, true));

    const items = yield select(itemsBatchSelector, { itemIds });
    const currentIsPersonal = !oldTeamId || oldTeamId === TEAM_TYPE.PERSONAL;
    const newIsPersonal = !teamId || teamId === TEAM_TYPE.PERSONAL;
    let reencryptedItems = null;
    let reencryptedSharedKeypairs = null;

    if (oldTeamId !== teamId) {
      // Need to reencrypt items
      const notSharedItems = items.filter(item => !item.isShared);
      const sharedItems = items.filter(item => item.isShared);

      const publicKey = yield call(getPublicKeyToEncrypt, teamId);

      if (notSharedItems.length) {
        // Need to decrypt item secrets just which are not shared
        const itemsNeedToDecrypt = notSharedItems.filter(item => !item.data);
        const notSharedItemIds = notSharedItems.map(({ id }) => id);

        // Decrypt item secret here if data does not exist
        if (itemsNeedToDecrypt.length) {
          yield all(
            itemsNeedToDecrypt.map(item => call(decryptItemSync, item)),
          );
        }

        const decryptedItems = yield select(itemsBatchSelector, {
          itemIds: notSharedItemIds,
        });

        const reencryptedItemSecrets = yield all(
          decryptedItems.map(item => ({
            ...call(reencryptItemSecretSaga, {
              item,
              publicKey,
              updateRawsCertainly: !item.isShared,
            }),
            itemId: item.id,
          })),
        );

        reencryptedItems = decryptedItems.map((item, index) => ({
          id: item.id,
          data: reencryptedItemSecrets[index].data,
          secret: reencryptedItemSecrets[index].secretDataAndRaws.secret,
        }));
      }

      if (reencryptedItems) {
        // Send to server updated data about not shared items
        const itemChunks = chunk(reencryptedItems, ENCRYPTION_CHUNK_SIZE);

        yield all(
          itemChunks.map(itemChunk =>
            call(
              callMoveItemBatchRoute,
              listId,
              {
                items: itemChunk.map(({ id, secret }) => ({
                  itemId: id,
                  secret,
                })),
              },
              currentIsPersonal,
              oldTeamId,
            ),
          ),
        );

        const itemSecrets =
          reencryptedItems.reduce(
            (acc, item) => ({
              ...acc,
              [item.id]: item.secret,
            }),
            {},
          ) || {};

        yield put(
          moveItemsBatchSuccess({
            itemIds,
            previousListId,
            newTeamId: teamId,
            newListId: newIsPersonal ? listId : null,
            newTeamListId: newIsPersonal ? null : listId,
            itemSecrets,
          }),
        );
      }

      if (sharedItems.length) {
        reencryptedSharedKeypairs = yield all(
          sharedItems.map(item => reencryptSharedKeypair(item, publicKey)),
        );
      }

      if (reencryptedSharedKeypairs) {
        // Send to server updated data about shared items
        const keypairChunks = chunk(
          reencryptedSharedKeypairs,
          ENCRYPTION_CHUNK_SIZE,
        );
        const itemChunks = chunk(sharedItems, ENCRYPTION_CHUNK_SIZE);
        const sharedItemIds = sharedItems.map(({ id }) => id);

        yield all(
          keypairChunks.map(keypairChunk =>
            call(
              callMoveItemBatchRoute,
              teamDefaultListId,
              {
                items: keypairChunk.map(({ id, secret }) => ({
                  itemId: id,
                  secret,
                })),
              },
              currentIsPersonal,
              oldTeamId,
            ),
          ),
        );
        yield all(
          itemChunks.map(itemChunk =>
            call(
              callMoveItemBatchRoute,
              listId,
              {
                items: itemChunk.map(({ id }) => ({ itemId: id })),
              },
              currentIsPersonal,
              oldTeamId,
            ),
          ),
        );

        const updatedShareKeyPairs = reencryptedSharedKeypairs.map(keypair => ({
          relatedItemId: keypair.relatedItemId,
          teamId,
        }));

        yield put(updateShareKeyPairBatch({ updatedShareKeyPairs }));
        yield put(
          moveItemsBatchSuccess({
            itemIds: sharedItemIds,
            previousListId,
            newTeamId: teamId,
            newListId: newIsPersonal ? listId : null,
            newTeamListId: newIsPersonal ? null : listId,
          }),
        );
      }
    }

    if (!reencryptedItems && !reencryptedSharedKeypairs) {
      // Send data to server about items moved within one vault
      const itemChunks = chunk(items, ENCRYPTION_CHUNK_SIZE);

      yield all(
        itemChunks.map(itemChunk =>
          call(
            callMoveItemBatchRoute,
            listId,
            { items: itemChunk.map(({ id }) => ({ itemId: id })) },
            currentIsPersonal,
            oldTeamId,
          ),
        ),
      );

      yield put(
        moveItemsBatchSuccess({
          itemIds,
          newTeamId: teamId,
          previousListId,
          newListId: newIsPersonal ? listId : null,
          newTeamListId: newIsPersonal ? null : listId,
        }),
      );
    }

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

export function* moveItemSagas() {
  yield takeLatest(MOVE_ITEM_REQUEST, moveItemSaga);
  yield takeLatest(MOVE_ITEMS_BATCH_REQUEST, moveItemsBatchSaga);
}
