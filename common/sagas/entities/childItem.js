import { call, fork, put, select, take, takeLatest } from 'redux-saga/effects';
import {
  CHANGE_CHILD_ITEM_PERMISSION_REQUEST,
  CREATE_CHILD_ITEM_BATCH_REQUEST,
  INVITE_MEMBER_REQUEST,
  INVITE_NEW_MEMBER_REQUEST,
  REMOVE_INVITE_REQUEST,
  UPDATE_CHILD_ITEM_BATCH_REQUEST,
  changeChildItemPermissionFailure,
  changeChildItemPermissionSuccess,
  inviteMemberFailure,
  inviteMemberSuccess,
  inviteNewMemberFailure,
  removeInviteMemberFailure,
  removeInviteMemberSuccess,
  updateChildItemsBatchFailure,
  createChildItemBatchFinishedEvent,
  addChildItemsBatch, createChildItemBatchSuccess, createChildItemBatchFailure,
} from 'common/actions/entities/childItem';
import { encryption } from 'common/sagas/common/encryption';
import {
  addChildItemToItem,
  removeChildItemFromItem,
} from 'common/actions/entities/item';
import { updateWorkInProgressItem } from 'common/actions/workflow';
import { ENCRYPTION_FINISHED_EVENT } from 'common/actions/application';
import {
  memberListSelector,
  membersByIdSelector,
} from 'common/selectors/entities/member';
import { workInProgressItemSelector } from 'common/selectors/workflow';
import { childItemsBatchSelector } from 'common/selectors/entities/childItem';
import {
  deleteChildItem,
  patchChildAccess,
  patchChildItemBatch,
  postCreateChildItem,
  postCreateChildItemBatch,
  postInvitation,
} from 'common/api';
import { encryptItem } from 'common/utils/cipherUtils';
import { objectToBase64 } from 'common/utils/base64';
import {
  CHILD_ITEM_ENTITY_TYPE,
  INVITE_TYPE,
  PERMISSION_READ,
  PERMISSION_WRITE,
} from 'common/constants';
import { generateInviteUrl } from 'common/utils/sharing';

export function* inviteMemberSaga({ payload: { userId } }) {
  try {
    const workInProgressItem = yield select(workInProgressItemSelector);
    const members = yield select(memberListSelector);

    const member = members.find(({ id }) => id === userId);

    const encryptedItemSecret = yield call(
      encryptItem,
      workInProgressItem.data,
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

    const childItemId = items[0].id;

    yield put(inviteMemberSuccess(workInProgressItem.id, childItemId, member));
    yield put(addChildItemToItem(workInProgressItem.id, childItemId));
    yield put(updateWorkInProgressItem());
  } catch (error) {
    console.log(error);
    yield put(inviteMemberFailure());
  }
}

export function* inviteNewMemberSaga({
  payload: {
    member: { email, password, masterPassword },
  },
}) {
  try {
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

export function* removeInviteMemberSaga({ payload: { childItemId } }) {
  try {
    const workInProgressItem = yield select(workInProgressItemSelector);

    yield call(deleteChildItem, childItemId);

    yield put(removeInviteMemberSuccess(childItemId));
    yield put(removeChildItemFromItem(workInProgressItem.id, childItemId));
    yield put(updateWorkInProgressItem());
  } catch (error) {
    console.log(error);
    yield put(removeInviteMemberFailure());
  }
}

export function* createChildItemBatchSaga({ payload: { itemUserPairs } }) {
  try {
    yield fork(encryption, itemUserPairs);

    const {
      payload: { sets: encryptedChildItems },
    } = yield take(ENCRYPTION_FINISHED_EVENT);

    console.log('encryptedChildItems', encryptedChildItems);

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
        ({ userId, secret }) => ({
          userId,
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
  yield takeLatest(INVITE_MEMBER_REQUEST, inviteMemberSaga);
  yield takeLatest(INVITE_NEW_MEMBER_REQUEST, inviteNewMemberSaga);
  yield takeLatest(REMOVE_INVITE_REQUEST, removeInviteMemberSaga);
  yield takeLatest(CREATE_CHILD_ITEM_BATCH_REQUEST, createChildItemBatchSaga);
  yield takeLatest(UPDATE_CHILD_ITEM_BATCH_REQUEST, updateChildItemsBatchSaga);
  yield takeLatest(
    CHANGE_CHILD_ITEM_PERMISSION_REQUEST,
    changeChildItemPermissionSaga,
  );
}
