import { put, call, takeLatest, select } from 'redux-saga/effects';
import {
  ACCEPT_ITEM_UPDATE_REQUEST,
  REJECT_ITEM_UPDATE_REQUEST,
  acceptItemUpdateFailure,
  acceptItemUpdateSuccess,
  rejectItemUpdateFailure,
  rejectItemUpdateSuccess,
} from '@caesar/common/actions/entities/item';
import { masterPasswordSelector } from '@caesar/common/selectors/user';
import { acceptUpdateItem, rejectUpdateItem } from '@caesar/common/api';
import { decryptItem, getPrivateKeyObj } from '@caesar/common/utils/cipherUtils';
import { updateWorkInProgressItem } from '@caesar/common/actions/workflow';
import { updateGlobalNotification } from '@caesar/common/actions/application';
import { getServerErrorMessage } from '@caesar/common/utils/error';

export function* acceptItemSaga({ payload: { id } }) {
  try {
    const keyPair = yield select(personalKeyPairSelector);
    const masterPassword = yield select(masterPasswordSelector);

    const {
      data: { secret, ...itemData },
    } = yield call(acceptUpdateItem, id);

    const privateKeyObj = yield call(
      getPrivateKeyObj,
      keyPair.privateKey,
      masterPassword,
    );

    const decryptedItemSecret = yield decryptItem(secret, privateKeyObj);

    const newItem = {
      ...itemData,
      secret,
      data: decryptedItemSecret,
      invited: itemData.invited.map(({ id: childId }) => childId),
    };

    yield put(acceptItemUpdateSuccess(newItem));
    yield put(updateWorkInProgressItem());
  } catch (error) {
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(acceptItemUpdateFailure(error));
  }
}

export function* rejectItemSaga({ payload: { id } }) {
  try {
    yield call(rejectUpdateItem, id);

    yield put(rejectItemUpdateSuccess(id));
    yield put(updateWorkInProgressItem());
  } catch (error) {
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(rejectItemUpdateFailure(error));
  }
}


export function* acceptRejectItemSagas() {
  yield takeLatest(ACCEPT_ITEM_UPDATE_REQUEST, acceptItemSaga);
  yield takeLatest(REJECT_ITEM_UPDATE_REQUEST, rejectItemSaga);

}