import { put, call, takeLatest, select } from 'redux-saga/effects';
import { workInProgressItemSelector } from '@caesar/common/selectors/workflow';
import {
  encryptItem,
  generateAnonymousEmail,
} from '@caesar/common/utils/cipherUtils';
import { createMemberSaga } from '@caesar/common/sagas/entities/member';
import { DOMAIN_ROLES } from '@caesar/common/constants';
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
        role: DOMAIN_ROLES.ROLE_ANONYMOUS_USER,
      },
    });

    // TODO: Add new flow of sharing with keipair.share
    // eslint-disable-next-line no-console
    console.warn('Not yet implemented');
    const encryptedSecret = yield call(
      encryptItem,
      workInProgressItem.data,
      publicKey,
    );

    const item = {
      id: 'itemId',
      secret: encryptedSecret,
    };

    // TODO: Make shorted link
    const link = generateSharingUrl(
      item.id,
      objectToBase64({
        e: email,
        p: password,
        mp: masterPassword,
      }),
    );

    const share = {
      id: item.id,
      userId,
      email,
      name,
      link,
      publicKey,
      isAccepted: false,
      domainRoles: [DOMAIN_ROLES.ROLE_ANONYMOUS_USER],
    };

    yield put(createAnonymousLinkSuccess(workInProgressItem.id, share));
    yield put(updateWorkInProgressItem());
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(createAnonymousLinkFailure());
  }
}

export function* removeAnonymousLinkSaga() {
  try {
    // TODO: Fix remove anonym flow
    const workInProgressItem = yield select(workInProgressItemSelector);

    yield put(removeAnonymousLinkSuccess(workInProgressItem.id));
    yield put(updateWorkInProgressItem());
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
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
