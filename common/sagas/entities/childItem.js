import { put, call, takeLatest, select } from 'redux-saga/effects';
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
import {
  addChildItemToItem,
  addChildItemsBatchToItem,
  removeChildItemFromItem,
} from 'common/actions/entities/item';
import { updateWorkInProgressItem } from 'common/actions/workflow';
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
import { encryptItem, encryptItemForUsers } from 'common/utils/cipherUtils';
import { objectToBase64 } from 'common/utils/base64';
import {
  INVITE_TYPE,
  PERMISSION_READ,
  PERMISSION_WRITE,
  ROLE_USER,
} from 'common/constants';
import { generateInviteUrl } from 'common/utils/sharing';
import { createMemberSaga, getOrCreateMemberBatchSaga } from './member';

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

export function* inviteNewMemberSaga({ payload: { email } }) {
  try {
    const { id, masterPassword, password } = yield call(createMemberSaga, {
      payload: {
        email,
        role: ROLE_USER,
      },
    });

    yield call(inviteMemberSaga, { payload: { userId: id } });

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

export function* shareItemBatchSaga({ payload: { items, emails } }) {
  try {
    const itemsById = yield select(itemsByIdSelector);

    const sharedItems = items.map(itemId => itemsById[itemId]);

    const members = yield call(getOrCreateMemberBatchSaga, {
      payload: { emails, role: ROLE_USER },
    });

    const data = [];
    const invitations = [];

    // eslint-disable-next-line
    for (const item of sharedItems) {
      const itemInvitedUsers = item.invited.map(({ userId }) => userId);

      const users = members.filter(
        user => !!user && !itemInvitedUsers.includes(user.userId),
      );

      const userKeys = users.map(({ publicKey }) => publicKey);

      const invitedEncryptedSecrets = yield call(
        encryptItemForUsers,
        item.data,
        userKeys,
      );

      const invitedChildItems = invitedEncryptedSecrets.map((secret, idx) => ({
        secret,
        userId: users[idx].userId,
        access: PERMISSION_READ,
        cause: INVITE_TYPE,
      }));

      data.push({
        originalItem: item.id,
        items: invitedChildItems,
      });

      invitations.push(
        ...users
          .filter(({ isNew }) => !!isNew)
          .map(({ email, password, masterPassword }) => ({
            email,
            url: generateInviteUrl(
              objectToBase64({
                e: email,
                p: password,
                mp: masterPassword,
              }),
            ),
          })),
      );
    }

    const {
      data: { shares },
    } = yield call(postCreateChildItemBatch, {
      originalItems: data,
    });

    yield call(postInvitationBatch, { messages: invitations });

    const invited = shares.reduce(
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

    yield put(shareItemBatchSuccess(invited));

    const sets = shares.reduce(
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
    item: { id, data, invited: childItemIds },
  },
}) {
  try {
    const childItems = yield select(childItemsBatchSelector, { childItemIds });
    const members = yield select(membersByIdSelector);

    const userIds = childItems.map(({ userId }) => userId);
    const memberKeys = userIds.map(userId => members[userId].publicKey);

    const childItemEncryptedSecrets = yield call(
      encryptItemForUsers,
      data,
      memberKeys,
    );

    const childItemsForRequest = childItemEncryptedSecrets.map(
      (encryptedSecret, index) => ({
        userId: userIds[index],
        secret: encryptedSecret,
      }),
    );

    yield call(patchChildItemBatch, {
      collectionItems: [
        {
          originalItem: id,
          items: childItemsForRequest,
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
