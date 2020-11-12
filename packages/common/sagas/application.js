import { put, fork, takeLatest, select } from 'redux-saga/effects';
import { decryption } from '@caesar/common/sagas/common/decryption';
import {
  REHYDRATE_STORE,
  RESET_STORE,
  resetApplicationState,
} from '@caesar/common/actions/application';
import { resetItemState } from '@caesar/common/actions/entities/item';
import { resetListState } from '@caesar/common/actions/entities/list';
import { resetMemberState } from '@caesar/common/actions/entities/member';
import { resetTeamState } from '@caesar/common/actions/entities/team';
import { resetSystemState } from '@caesar/common/actions/entities/system';
import { resetUserState } from '@caesar/common/actions/entities/user';
import { resetCurrentUserState } from '@caesar/common/actions/currentUser';
import { resetWorkflowState } from '@caesar/common/actions/workflow';
import { resetKeystoreState } from '@caesar/common/actions/keystore';
import { isOnlineSelector } from '@caesar/common/selectors/application';
import { itemArraySelector } from '@caesar/common/selectors/entities/item';
import { masterPasswordSelector } from '@caesar/common/selectors/currentUser';
import { actualKeyPairSelector } from '@caesar/common/selectors/keystore';

// TODO: Is conflicting with next-offline?
// @Depricated
export function* rehydrateStoreSaga() {
  try {
    const isOnline = yield select(isOnlineSelector);

    if (!isOnline) {
      const items = yield select(itemArraySelector);
      const keyPair = yield select(actualKeyPairSelector);
      const masterPassword = yield select(masterPasswordSelector);

      yield fork(decryption, {
        items,
        key: keyPair.privateKey,
        masterPassword,
      });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

function* resetStoreSaga() {
  try {
    yield put(resetMemberState());
    yield put(resetListState());
    yield put(resetItemState());
    yield put(resetTeamState());
    yield put(resetSystemState());
    yield put(resetApplicationState());
    yield put(resetUserState());
    yield put(resetWorkflowState());
    yield put(resetKeystoreState());
    yield put(resetCurrentUserState());
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

export default function* applicationSagas() {
  yield takeLatest(REHYDRATE_STORE, rehydrateStoreSaga);
  yield takeLatest(RESET_STORE, resetStoreSaga);
}
