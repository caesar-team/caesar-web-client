import { put, takeLatest } from 'redux-saga/effects';
import {
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
  yield takeLatest(RESET_STORE, resetStoreSaga);
}
