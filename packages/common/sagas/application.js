import { put, takeLatest, call } from 'redux-saga/effects';
import Router from 'next/router';
import {
  RESET_STORE,
  resetApplicationState,
  RESET_APPLICATION_CACHE,
  resetStore,
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
import { ROUTES } from '@caesar/common/constants';

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
export function* resetApplicationCacheSaga() {
  try {
    yield put(resetStore());
    yield call(Router.push, ROUTES.DASHBOARD);
  } catch (error) {
    console.error('error', error);
  }
}
export default function* applicationSagas() {
  yield takeLatest(RESET_STORE, resetStoreSaga);
  yield takeLatest(RESET_APPLICATION_CACHE, resetApplicationCacheSaga);
}
