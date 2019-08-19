import { put, call, takeLatest, select, all } from 'redux-saga/effects';
import {
  INVITE_MEMBER_REQUEST,
  INVITE_NEW_MEMBER_REQUEST,
  REMOVE_INVITE_REQUEST,
  REMOVE_SHARE_REQUEST,
  SHARE_ITEM_REQUEST,
  SHARE_ITEM_BATCH_REQUEST,
  CHANGE_CHILD_ITEM_PERMISSION_REQUEST,
  inviteMemberSuccess,
  inviteMemberFailure,
  inviteNewMemberFailure,
  removeInviteMemberSuccess,
  removeInviteMemberFailure,
  shareItemSuccess,
  shareItemFailure,
  shareItemBatchSuccess,
  shareItemBatchFailure,
  removeShareSuccess,
  removeShareFailure,
  changeChildItemPermissionSuccess,
  changeChildItemPermissionFailure,
} from 'common/actions/childItem';
import {
  addChildItemToItem,
  addChildItemsBatchToItem,
  removeChildItemFromItem,
  removeChildItemsBatchFromItem,
} from 'common/actions/item';
import { memberListSelector } from 'common/selectors/member';
import { workInProgressItemSelector } from 'common/selectors/workflow';
import { itemsByIdSelector } from 'common/selectors/item';
import {
  postCreateChildItem,
  postCreateChildItemBatch,
  postInvitation,
  postInvitationBatch,
  deleteChildItem,
  patchChildItem,
  patchChildAccess,
} from 'common/api';
import {
  encryptItem,
  encryptItemForUsers,
  objectToBase64,
  generateAnonymousEmail,
} from 'common/utils/cipherUtils';
import {
  ANONYMOUS_USER_ROLE,
  INVITE_TYPE,
  PERMISSION_READ,
  PERMISSION_WRITE,
  SHARE_TYPE,
  USER_ROLE,
} from 'common/constants';
import { generateInviteUrl, generateSharingUrl } from 'common/utils/sharing';
import { createMemberSaga, getOrCreateMemberBatchSaga } from './member';
import { setWorkInProgressItem } from '../actions/workflow';

export function* inviteMemberSaga({ payload: { userId } }) {
  try {
    const workInProgressItem = yield select(workInProgressItemSelector);
    const members = yield select(memberListSelector);

    const member = members.find(({ id }) => id === userId);

    const encryptedItemSecret = yield call(
      encryptItem,
      workInProgressItem.secret,
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
        role: USER_ROLE,
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

export function* removeInviteMemberSaga({ payload: { userId } }) {
  try {
    const workInProgressItem = yield select(workInProgressItemSelector);

    const childItem = workInProgressItem.invited.find(
      invite => invite.userId === userId,
    );

    yield call(deleteChildItem, childItem.id);

    yield put(removeInviteMemberSuccess(childItem.id));
    yield put(removeChildItemFromItem(workInProgressItem.id, childItem.id));
  } catch (error) {
    console.log(error);
    yield put(removeInviteMemberFailure());
  }
}

export function* shareItemSaga({ payload: { item, emails } }) {
  try {
    const itemInvitedUsers = item.invited.map(({ userId }) => userId);

    const response = yield call(getOrCreateMemberBatchSaga, {
      payload: {
        emails,
        role: USER_ROLE,
      },
    });

    const users = response.filter(
      user => !!user && !itemInvitedUsers.includes(user.userId),
    );

    const userKeys = users.map(({ publicKey }) => publicKey);

    const invitedEncryptedSecrets = yield call(
      encryptItemForUsers,
      item.secret,
      userKeys,
    );

    const invitedChildItems = invitedEncryptedSecrets.map((secret, idx) => ({
      secret,
      userId: users[idx].userId,
      access: PERMISSION_READ,
      cause: INVITE_TYPE,
    }));

    let invited = [];

    if (invitedChildItems.length) {
      const {
        data: { items },
      } = yield call(postCreateChildItem, item.id, {
        items: invitedChildItems,
      });

      invited = items.map(({ id, lastUpdatedAt }, idx) => ({
        id,
        updatedAt: lastUpdatedAt,
        userId: users[idx].userId,
        email: users[idx].email,
        access: PERMISSION_READ,
      }));

      const invitations = users
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
        }));

      yield all([...invitations.map(invitation => postInvitation(invitation))]);
    }

    yield put(shareItemSuccess(item.id, invited));
  } catch (error) {
    console.log(error);
    yield put(shareItemFailure());
  }
}

export function* shareItemBatchSaga({ payload: { items, emails } }) {
  try {
    const itemsById = yield select(itemsByIdSelector);

    const sharedItems = items.map(itemId => itemsById[itemId]);

    const members = yield call(getOrCreateMemberBatchSaga, {
      payload: { emails, role: USER_ROLE },
    });

    const membersObj = members.reduce(
      (accumulator, member) => ({
        ...accumulator,
        [member.userId]: member,
      }),
      {},
    );

    const data = [];
    const invitations = [];

    for (const item of sharedItems) {
      const itemInvitedUsers = item.invited.map(({ userId }) => userId);

      const users = members.filter(
        user => !!user && !itemInvitedUsers.includes(user.userId),
      );

      const userKeys = users.map(({ publicKey }) => publicKey);

      const invitedEncryptedSecrets = yield call(
        encryptItemForUsers,
        item.secret,
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
        {
          itemId: originalItemId,
          invited: childItems.map(({ id, userId, lastUpdated }) => ({
            id,
            updatedAt: lastUpdated,
            userId,
            email: membersObj[userId].email,
            access: PERMISSION_READ,
          })),
        },
      ],
      [],
    );

    yield put(shareItemBatchSuccess(invited));
  } catch (error) {
    console.log(error);
    yield put(shareItemBatchFailure());
  }
}

export function* removeShareSaga({ payload: { shareId } }) {
  try {
    const workInProgressItem = yield select(workInProgressItemSelector);

    yield call(deleteChildItem, shareId);

    yield put(removeShareSuccess(workInProgressItem.id, shareId));
  } catch (error) {
    console.log(error);
    yield put(removeShareFailure());
  }
}

export function* changeChildItemPermissionSaga({
  payload: { userId, permission },
}) {
  try {
    const workInProgressItem = yield select(workInProgressItemSelector);

    const childItem = workInProgressItem.invited.find(
      invite => invite.userId === userId,
    );

    yield call(patchChildAccess, childItem.id, { access: permission });
    yield put(changeChildItemPermissionSuccess(childItem.id, permission));
    yield put(
      setWorkInProgressItem(
        {
          ...workInProgressItem,
          invited: workInProgressItem.invited.map(invite =>
            invite.id === childItem.id
              ? { ...invite, access: permission }
              : invite,
          ),
        },
        workInProgressItem.mode,
      ),
    );
  } catch (error) {
    yield put(changeChildItemPermissionFailure());
  }
}

export default function* childItemSagas() {
  yield takeLatest(INVITE_MEMBER_REQUEST, inviteMemberSaga);
  yield takeLatest(INVITE_NEW_MEMBER_REQUEST, inviteNewMemberSaga);
  yield takeLatest(REMOVE_INVITE_REQUEST, removeInviteMemberSaga);
  yield takeLatest(SHARE_ITEM_REQUEST, shareItemSaga);
  yield takeLatest(SHARE_ITEM_BATCH_REQUEST, shareItemBatchSaga);
  yield takeLatest(REMOVE_SHARE_REQUEST, removeShareSaga);
  yield takeLatest(
    CHANGE_CHILD_ITEM_PERMISSION_REQUEST,
    changeChildItemPermissionSaga,
  );
}
