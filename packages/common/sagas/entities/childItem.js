import { call, all, put, select, take, takeLatest } from 'redux-saga/effects';
import {
  CHANGE_CHILD_ITEM_PERMISSION_REQUEST,
  CREATE_CHILD_ITEM_BATCH_REQUEST,
  UPDATE_CHILD_ITEM_BATCH_REQUEST,
  changeChildItemPermissionFailure,
  changeChildItemPermissionSuccess,
  updateChildItemsBatchFailure,
  createChildItemBatchFinishedEvent,
  createChildItemBatchSuccess,
  createChildItemBatchFailure,
} from '@caesar/common/actions/entities/childItem';
import {
  updateWorkInProgressItem,
  encryption,
} from '@caesar/common/actions/workflow';
import {
  ENCRYPTION_FINISHED_EVENT,
  updateGlobalNotification,
} from '@caesar/common/actions/application';
import { membersByIdSelector } from '@caesar/common/selectors/entities/member';
import { childItemsBatchSelector } from '@caesar/common/selectors/entities/childItem';
import {
  patchChildAccess,
  patchChildItemBatch,
  postCreateChildItemBatch,
} from '@caesar/common/api';
import { getServerErrorMessage } from '@caesar/common/utils/error';
import { chunk } from '@caesar/common/utils/utils';
import {
  ENTITY_TYPE,
  INVITE_TYPE,
  PERMISSION_READ,
  NOOP_NOTIFICATION,
} from '@caesar/common/constants';

const ITEM_CHILD_ITEM_CHUNK_SIZE = 50;

export function* createChildItemBatchSaga({ payload: { itemUserPairs } }) {console.log(itemUserPairs);
  try {
    yield put(encryption({ items: itemUserPairs }));

    const {
      payload: { sets: encryptedChildItems },
    } = yield take(ENCRYPTION_FINISHED_EVENT);

    const preparedChildItemsGroupedByItemId = encryptedChildItems.reduce(
      (accumulator, { itemId, ...data }) => {
        if (!accumulator[itemId]) {
          accumulator[itemId] = [];
        }

        return { ...accumulator, [itemId]: [...accumulator[itemId], data] };
      },
      {},
    );

    const itemChildItemsSets = Object.keys(
      preparedChildItemsGroupedByItemId,
    ).map(itemId => ({
      originalItem: itemId,
      items: preparedChildItemsGroupedByItemId[itemId].map(
        ({ userId, secret, teamId }) => ({
          userId,
          teamId,
          secret,
          access: PERMISSION_READ,
          cause: INVITE_TYPE,
        }),
      ),
    }));

    const itemChildItemsSetsChunks = chunk(
      itemChildItemsSets,
      ITEM_CHILD_ITEM_CHUNK_SIZE,
    );

    const itemChildItemsSetsChunksResponse = yield all(
      itemChildItemsSetsChunks.map(itemChildItemsSetsChunk =>
        call(postCreateChildItemBatch, {
          originalItems: itemChildItemsSetsChunk,
        }),
      ),
    );

    const shares = itemChildItemsSetsChunksResponse.reduce(
      (accumulator, itemChildItemsSetsChunk) => [
        ...accumulator,
        ...itemChildItemsSetsChunk.data.shares,
      ],
      [],
    );

    const childItems = shares.reduce(
      (accumulator, { originalItemId, items }) => [
        ...accumulator,
        ...items.map(item => ({ ...item, originalItemId })),
      ],
      [],
    );

    const childItemsById = childItems.reduce(
      (accumulator, childItem) => ({
        ...accumulator,
        [childItem.id]: {
          ...childItem,
          __type: ENTITY_TYPE.CHILD_ITEM,
        },
      }),
      {},
    );

    yield put(createChildItemBatchSuccess(childItemsById));

    yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));

    yield put(createChildItemBatchFinishedEvent(shares));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(createChildItemBatchFailure());
  }
}

export function* updateChildItemsBatchSaga({
  payload: {
    item: { id, data, invited },
  },
}) {
  try {
    // eslint-disable-next-line
    const childItems = yield select(childItemsBatchSelector, {
      childItemIds: invited,
    });
    const memberIds = childItems.map(({ userId }) => userId);

    const membersById = yield select(membersByIdSelector);
    const members = memberIds.map(memberId => membersById[memberId]);

    const itemUserPairs = members.map(member => ({
      item: { id, data },
      user: member,
    }));

    yield put(encryption({ items: itemUserPairs }));

    // stop and wait
    const {
      payload: { sets: encryptedChildItems },
    } = yield take(ENCRYPTION_FINISHED_EVENT);

    yield call(patchChildItemBatch, {
      collectionItems: [
        {
          originalItem: id,
          items: encryptedChildItems.map(({ userId, secret }) => ({
            userId,
            secret,
          })),
        },
      ],
    });

    yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(updateChildItemsBatchFailure());
  }
}

export function* changeChildItemPermissionSaga({
  payload: { childItemId, permission },
}) {
  try {
    yield call(patchChildAccess, childItemId, { access: permission });

    yield put(changeChildItemPermissionSuccess(childItemId, permission));
    yield put(updateWorkInProgressItem());
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(changeChildItemPermissionFailure());
  }
}

export default function* childItemSagas() {
  yield takeLatest(CREATE_CHILD_ITEM_BATCH_REQUEST, createChildItemBatchSaga);
  yield takeLatest(UPDATE_CHILD_ITEM_BATCH_REQUEST, updateChildItemsBatchSaga);
  yield takeLatest(
    CHANGE_CHILD_ITEM_PERMISSION_REQUEST,
    changeChildItemPermissionSaga,
  );
}
