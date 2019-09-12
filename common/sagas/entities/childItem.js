import { put, call, fork, takeLatest, select, take } from 'redux-saga/effects';
import {
  INVITE_MEMBER_REQUEST,
  INVITE_NEW_MEMBER_REQUEST,
  REMOVE_INVITE_REQUEST,
  REMOVE_SHARE_REQUEST,
  UPDATE_CHILD_ITEM_BATCH_REQUEST,
  SHARE_ITEM_BATCH_REQUEST,
  CHANGE_CHILD_ITEM_PERMISSION_REQUEST,
  inviteMemberSuccess,
  inviteMemberFailure,
  inviteNewMemberFailure,
  removeInviteMemberSuccess,
  removeInviteMemberFailure,
  shareItemBatchSuccess,
  shareItemBatchFailure,
  removeShareSuccess,
  removeShareFailure,
  updateChildItemsBatchFailure,
  changeChildItemPermissionSuccess,
  changeChildItemPermissionFailure,
} from 'common/actions/entities/childItem';
import { encryption } from 'common/sagas/common/encryption';
import {
  addChildItemToItem,
  addChildItemsBatchToItem,
  removeChildItemFromItem,
} from 'common/actions/entities/item';
import { updateWorkInProgressItem } from 'common/actions/workflow';
import { ENCRYPTION_FINISHED_EVENT } from 'common/actions/application';
import {
  memberListSelector,
  membersByIdSelector,
} from 'common/selectors/entities/member';
import { workInProgressItemSelector } from 'common/selectors/workflow';
import { itemsByIdSelector } from 'common/selectors/entities/item';
import { childItemsBatchSelector } from 'common/selectors/entities/childItem';
import {
  postCreateChildItem,
  postCreateChildItemBatch,
  postInvitation,
  postInvitationBatch,
  deleteChildItem,
  patchChildAccess,
  patchChildItemBatch,
} from 'common/api';
import { encryptItem } from 'common/utils/cipherUtils';
import { objectToBase64 } from 'common/utils/base64';
import {
  INVITE_TYPE,
  PERMISSION_READ,
  PERMISSION_WRITE,
  ROLE_USER,
} from 'common/constants';
import { generateInviteUrl } from 'common/utils/sharing';
import { getOrCreateMemberBatchSaga } from 'common/sagas/entities/member';

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

function* inviteNewMemberBatchSaga({ payload: { members } }) {
  try {
    const invites = members.map(({ email, password, masterPassword }) => ({
      email,
      url: generateInviteUrl(
        objectToBase64({
          e: email,
          p: password,
          mp: masterPassword,
        }),
      ),
    }));

    yield call(postInvitationBatch, { messages: invites });
  } catch (error) {
    console.log(error);
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

export function* shareItemBatchSaga({ payload: { items, members } }) {
  try {
    // find items which will be share
    const itemsById = yield select(itemsByIdSelector);
    const sharingItems = items.map(itemId => itemsById[itemId]);
    const sharingItemIds = sharingItems.map(({ id }) => id);

    // get or create members, get their actual keys and other data
    const memberEmails = members.map(({ email }) => email);
    const emailRolePairs = memberEmails.map(email => ({
      email,
      role: ROLE_USER,
    }));
    const membersOfSharing = yield call(getOrCreateMemberBatchSaga, {
      payload: { emailRolePairs },
    });
    const newMembers = members.filter(({ isNew }) => isNew);

    // run pool of workers for encryption items by members key
    yield fork(encryption, { items: sharingItems, users: membersOfSharing });

    // stop and wait
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

    const preparedItemsForRequest = sharingItemIds.map(itemId => ({
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

    const { data } = yield call(postCreateChildItemBatch, {
      originalItems: Object.values(preparedItemsForRequest),
    });

    yield fork(inviteNewMemberBatchSaga, { payload: { members: newMembers } });

    const shares = data.shares.reduce(
      (accumulator, { originalItemId, items: childItems }) => [
        ...accumulator,
        ...childItems.map(({ id, userId }) => ({
          id,
          originalItemId,
          userId,
          access: PERMISSION_READ,
        })),
      ],
      [],
    );

    yield put(shareItemBatchSuccess(shares));

    const sets = data.shares.reduce(
      (accumulator, item) => [
        ...accumulator,
        {
          itemId: item.originalItemId,
          childItemIds: item.items.map(({ id }) => id),
        },
      ],
      [],
    );

    yield put(addChildItemsBatchToItem(sets));
    yield put(updateWorkInProgressItem());
  } catch (error) {
    console.log(error);
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
  } catch (error) {
    console.log(error);
    yield put(removeShareFailure());
  }
}

export function* updateChildItemsBatchSaga({
  payload: {
    item: { id, data, invited },
  },
}) {
  try {
    // eslint-disable-next-line
    const childItemIds = invited.map(({ id }) => id);
    const memberIds = invited.map(({ userId }) => userId);

    const membersById = yield select(membersByIdSelector);
    const childItems = yield select(childItemsBatchSelector, { childItemIds });

    const updatingChildItems = childItems.map(childItem => ({
      ...childItem,
      data,
    }));
    const members = memberIds.map(memberId => membersById[memberId]);

    yield fork(encryption, { items: updatingChildItems, users: members });

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
  yield takeLatest(SHARE_ITEM_BATCH_REQUEST, shareItemBatchSaga);
  yield takeLatest(REMOVE_SHARE_REQUEST, removeShareSaga);
  yield takeLatest(UPDATE_CHILD_ITEM_BATCH_REQUEST, updateChildItemsBatchSaga);
  yield takeLatest(
    CHANGE_CHILD_ITEM_PERMISSION_REQUEST,
    changeChildItemPermissionSaga,
  );
}
