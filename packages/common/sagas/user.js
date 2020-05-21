import Router from 'next/router';
import { put, call, takeLatest, select } from 'redux-saga/effects';
import {
  FETCH_USER_SELF_REQUEST,
  FETCH_KEY_PAIR_REQUEST,
  FETCH_USER_TEAMS_REQUEST,
  LOGOUT,
  fetchUserSelfSuccess,
  fetchUserSelfFailure,
  fetchKeyPairSuccess,
  fetchKeyPairFailure,
  fetchUserTeamsSuccess,
  fetchUserTeamsFailure,
  setCurrentTeamId,
} from '@caesar/common/actions/user';
import { addTeamsBatch } from '@caesar/common/actions/entities/team';
import { addMembersBatch } from '@caesar/common/actions/entities/member';
import { currentTeamIdSelector } from '@caesar/common/selectors/user';
import { convertTeamsToEntity } from '@caesar/common/normalizers/normalizers';
import { getUserSelf, getKeys, getUserTeams } from '@caesar/common/api';
import { removeCookieValue } from '@caesar/common/utils/token';
import { ROUTES } from '@caesar/common/constants';

export function* fetchUserSelfSaga() {
  try {
    const { data: user } = yield call(getUserSelf);

    // TODO: added teamIds on BE side
    const fixedUser = {
      ...user,
      teamIds: user.teamIds || [],
    };

    yield put(fetchUserSelfSuccess(fixedUser));
    yield put(addMembersBatch({ [fixedUser.id]: fixedUser }));
  } catch (error) {
    console.log('error', error);
    yield put(fetchUserSelfFailure());
  }
}

export function* fetchKeyPairSaga() {
  try {
    const { data } = yield call(getKeys);

    yield put(
      fetchKeyPairSuccess({
        privateKey: data.encryptedPrivateKey,
        publicKey: data.publicKey,
      }),
    );
  } catch (error) {
    console.log('error', error);
    yield put(fetchKeyPairFailure());
  }
}

export function* fetchUserTeamsSaga() {
  try {
    const { data } = yield call(getUserTeams);

    if (data.length) {
      yield put(fetchUserTeamsSuccess(data.map(({ id }) => id)));
      // TODO: need fixes from BE
      yield put(addTeamsBatch(convertTeamsToEntity(data)));

      const currentTeamId = yield select(currentTeamIdSelector);
      put(setCurrentTeamId(currentTeamId || data[0].id));
    }
  } catch (error) {
    console.log('error', error);
    yield put(fetchUserTeamsFailure());
  }
}

export function* logoutSaga() {
  try {
    yield call([localStorage, localStorage.clear]);
    yield call(removeCookieValue, 'token');
    yield call(Router.push, ROUTES.LOGOUT);
  } catch (error) {
    console.log('error', error);
  }
}

export default function* userSagas() {
  yield takeLatest(FETCH_USER_SELF_REQUEST, fetchUserSelfSaga);
  yield takeLatest(FETCH_KEY_PAIR_REQUEST, fetchKeyPairSaga);
  yield takeLatest(FETCH_USER_TEAMS_REQUEST, fetchUserTeamsSaga);
  yield takeLatest(LOGOUT, logoutSaga);
}
