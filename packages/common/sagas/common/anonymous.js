import { put, call, takeLatest, select } from 'redux-saga/effects';
import { workInProgressItemSelector } from '@caesar/common/selectors/workflow';
import {
  encryptItem,
  generateAnonymousEmail,
} from '@caesar/common/utils/cipherUtils';
import { createMemberSaga } from '@caesar/common/sagas/entities/member';
import {
  PERMISSION_READ,
  ROLE_ANONYMOUS_USER,
  SHARE_TYPE,
} from '@caesar/common/constants';
import {
  deleteChildItem,
  patchChildItem,
  postCreateChildItem,
} from '@caesar/common/api';
import { generateSharingUrl } from '@caesar/common/utils/sharing';
import { objectToBase64 } from '@caesar/common/utils/base64';
import {
  CREATE_ANONYMOUS_LINK_REQUEST,
  REMOVE_ANONYMOUS_LINK_REQUEST,
  createAnonymousLinkFailure,
  createAnonymousLinkSuccess,
  removeAnonymousLinkFailure,
  removeAnonymousLinkSuccess,
} from '@caesar/common/actions/entities/item';
import { updateWorkInProgressItem } from '@caesar/common/actions/workflow';
import { updateGlobalNotification } from '@caesar/common/actions/application';
import { getServerErrorMessage } from '@caesar/common/utils/error';

export function* createAnonymousLinkSaga() {
  try {
    const workInProgressItem = yield select(workInProgressItemSelector);

    const email = generateAnonymousEmail();

    const {
      id: userId,
      name,
      password,
      masterPassword,
      publicKey,
    } = yield call(createMemberSaga, {
      payload: {
        email,
        role: ROLE_ANONYMOUS_USER,
      },
    });

    const encryptedSecret = yield call(
      encryptItem,
      workInProgressItem.data,
      publicKey,
    );

    const {
      data: { items },
    } = yield call(postCreateChildItem, workInProgressItem.id, {
      items: [
        {
          userId,
          secret: encryptedSecret,
          cause: SHARE_TYPE,
          access: PERMISSION_READ,
        },
      ],
    });

    const link = generateSharingUrl(
      items[0].id,
      objectToBase64({
        e: email,
        p: password,
        mp: masterPassword,
      }),
    );

    yield call(patchChildItem, workInProgressItem.id, {
      items: [{ userId, link, secret: encryptedSecret }],
    });

    const share = {
      id: items[0].id,
      userId,
      email,
      name,
      link,
      publicKey,
      isAccepted: false,
      roles: [ROLE_ANONYMOUS_USER],
    };

    yield put(createAnonymousLinkSuccess(workInProgressItem.id, share));
    yield put(updateWorkInProgressItem());
  } catch (error) {
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(createAnonymousLinkFailure());
  }
}

export function* removeAnonymousLinkSaga() {
  try {
    const workInProgressItem = yield select(workInProgressItemSelector);

    yield call(deleteChildItem, workInProgressItem.shared.id);

    yield put(removeAnonymousLinkSuccess(workInProgressItem.id));
    yield put(updateWorkInProgressItem());
  } catch (error) {
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(removeAnonymousLinkFailure());
  }
}

export function* anonymousSagas() {
  yield takeLatest(CREATE_ANONYMOUS_LINK_REQUEST, createAnonymousLinkSaga);
  yield takeLatest(REMOVE_ANONYMOUS_LINK_REQUEST, removeAnonymousLinkSaga);
}