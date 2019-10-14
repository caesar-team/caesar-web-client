import { call, fork, put, select, take, takeLatest } from 'redux-saga/effects';
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
} from 'common/actions/entities/childItem';
import { encryption } from 'common/sagas/common/encryption';
import { updateWorkInProgressItem } from 'common/actions/workflow';
import {
  ENCRYPTION_FINISHED_EVENT,
  updateGlobalNotification,
} from 'common/actions/application';
import { membersByIdSelector } from 'common/selectors/entities/member';
import { childItemsBatchSelector } from 'common/selectors/entities/childItem';
import {
  patchChildAccess,
  patchChildItemBatch,
  postCreateChildItemBatch,
} from 'common/api';
import {
  CHILD_ITEM_ENTITY_TYPE,
  INVITE_TYPE,
  PERMISSION_READ,
  CREATING_CHILD_ITEMS_NOTIFICATION,
  UPDATING_CHILD_ITEMS_NOTIFICATION,
  ENCRYPTING_CHILD_ITEMS_NOTIFICATION,
  NOOP_NOTIFICATION,
} from 'common/constants';

export function* createChildItemBatchSaga({ payload: { itemUserPairs } }) {
  try {
    yield put(
      updateGlobalNotification(ENCRYPTING_CHILD_ITEMS_NOTIFICATION, true),
    );

    yield fork(encryption, itemUserPairs);

    const {
      payload: { sets: encryptedChildItems },
    } = yield take(ENCRYPTION_FINISHED_EVENT);

    console.log('encryptedChildItems', encryptedChildItems);

    yield put(
      updateGlobalNotification(CREATING_CHILD_ITEMS_NOTIFICATION, true),
    );

    const preparedChildItemsGroupedByItemId = encryptedChildItems.reduce(
      (accumulator, { itemId, ...data }) => {
        if (!accumulator[itemId]) {
          accumulator[itemId] = [];
        }

        return { ...accumulator, [itemId]: [...accumulator[itemId], data] };
      },
      {},
    );

    const preparedItemsForRequest = Object.keys(
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

    const {
      data: { shares },
    } = yield call(postCreateChildItemBatch, {
      originalItems: Object.values(preparedItemsForRequest),
    });

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
          __type: CHILD_ITEM_ENTITY_TYPE,
        },
      }),
      {},
    );

    yield put(createChildItemBatchSuccess(childItemsById));

    yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));

    yield put(createChildItemBatchFinishedEvent(shares));
  } catch (error) {
    yield put(createChildItemBatchFailure());
  }
}

export function* updateChildItemsBatchSaga({
  payload: {
    item: { id, data, invited },
  },
}) {
  try {
    yield put(
      updateGlobalNotification(ENCRYPTING_CHILD_ITEMS_NOTIFICATION, true),
    );

    // eslint-disable-next-line
    const childItems = yield select(childItemsBatchSelector, { childItemIds: invited });
    const memberIds = childItems.map(({ userId }) => userId);

    const membersById = yield select(membersByIdSelector);
    const members = memberIds.map(memberId => membersById[memberId]);

    const itemUserPairs = members.map(member => ({
      item: { id, data },
      user: member,
    }));

    yield fork(encryption, itemUserPairs);

    // stop and wait
    const {
      payload: { sets: encryptedChildItems },
    } = yield take(ENCRYPTION_FINISHED_EVENT);

    yield put(
      updateGlobalNotification(UPDATING_CHILD_ITEMS_NOTIFICATION, true),
    );

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
    console.log(error);
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
