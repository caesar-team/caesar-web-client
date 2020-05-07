import { fork, takeLatest, select } from 'redux-saga/effects';
import { decryption } from '@caesar/common/sagas/common/decryption';
import { REHYDRATE_STORE } from '@caesar/common/actions/application';
import { isOnlineSelector } from '@caesar/common/selectors/application';
import { itemListSelector } from '@caesar/common/selectors/entities/item';
import { keyPairSelector, masterPasswordSelector } from '../selectors/user';

export function* rehydrateStoreSaga() {
  try {
    const isOnline = yield select(isOnlineSelector);

    if (!isOnline) {
      const items = yield select(itemListSelector);
      const keyPair = yield select(keyPairSelector);
      const masterPassword = yield select(masterPasswordSelector);

      yield fork(decryption, {
        items,
        key: keyPair.privateKey,
        masterPassword,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export default function* applicationSagas() {
  yield takeLatest(REHYDRATE_STORE, rehydrateStoreSaga);
}
