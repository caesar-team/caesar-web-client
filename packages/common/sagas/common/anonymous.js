import { put, call, takeLatest, select } from 'redux-saga/effects';
import { workInProgressItemSelector } from '@caesar/common/selectors/workflow';
import { generateAnonymousEmail } from '@caesar/common/utils/item';
import { createUserSaga } from '@caesar/common/sagas/entities/user';
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
import { shareItemBatchSaga } from './share';

export function* createAnonymousLinkSaga() {
  try {
    const workInProgressItem = yield select(workInProgressItemSelector);

    const email = generateAnonymousEmail(workInProgressItem.id);

    const createdUser = yield call(createUserSaga, {
      payload: {
        email,
        domainRole: DOMAIN_ROLES.ROLE_ANONYMOUS_USER,
      },
    });

    const {
      id: userId,
      name,
      password,
      masterPassword,
      publicKey,
      domainRoles,
    } = createdUser;

    yield call(shareItemBatchSaga, {
      payload: {
        data: { itemIds: [workInProgressItem.id], members: [createdUser] },
      },
    });

    // TODO: Make shorted link
    const link = generateSharingUrl(
      workInProgressItem.id,
      objectToBase64({
        e: email,
        p: password,
        m: masterPassword,
      }),
    );

    const shared = {
      id: workInProgressItem.id,
      userId,
      email,
      name,
      link,
      publicKey,
      isAccepted: false,
      domainRoles,
    };

    // TODO: Add request to update 'shared' item
    yield put(createAnonymousLinkSuccess(workInProgressItem.id, shared));
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
