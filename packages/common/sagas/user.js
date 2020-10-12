/* eslint-disable no-console */
import Router from 'next/router';
import { put, call, all, takeLatest, select } from 'redux-saga/effects';
import {
  FETCH_USER_SELF_REQUEST,
  FETCH_KEY_PAIR_REQUEST,
  FETCH_USER_TEAMS_REQUEST,
  LOGOUT,
  fetchUserSelfSuccess,
  fetchUserSelfFailure,
  fetchKeyPairFailure,
  fetchUserTeamsSuccess,
  fetchUserTeamsFailure,
  setCurrentTeamId,
} from '@caesar/common/actions/user';
import { addPersonalKeyPair } from '@caesar/common/actions/keystore';
import { addTeamsBatch } from '@caesar/common/actions/entities/team';
import { addMembersBatch } from '@caesar/common/actions/entities/member';
import { membersByIdSelector } from '@caesar/common/selectors/entities/member';
import { currentTeamIdSelector } from '@caesar/common/selectors/user';
import { convertTeamsToEntity } from '@caesar/common/normalizers/normalizers';
import {
  getUserSelf,
  getKeys,
  getUserTeams,
  postLogout,
} from '@caesar/common/api';
import { removeCookieValue, clearStorage } from '@caesar/common/utils/token';
import { createPermissionsFromLinks } from '@caesar/common/utils/createPermissionsFromLinks';
import { ROUTES } from '@caesar/common/constants';
import { objectToArray } from '../utils/utils';

export function* fetchUserSelfSaga() {
  try {
    const { data: user } = yield call(getUserSelf);
    const membersById = yield select(membersByIdSelector);

    // TODO: Move to normalizr
    const fixedUser = {
      ...membersById[user.id],
      ...user,
      _permissions: createPermissionsFromLinks(user._links),
      teamIds: user.teamIds || [],
    };

    yield put(fetchUserSelfSuccess(fixedUser));
    yield put(addMembersBatch({ [fixedUser.id]: fixedUser }));
  } catch (error) {
    console.error('error', error);
    yield put(fetchUserSelfFailure());
  }
}

export function* fetchKeyPairSaga() {
  try {
    const { data } = yield call(getKeys);

    yield put(
      addPersonalKeyPair({
        privateKey: data.encryptedPrivateKey,
        publicKey: data.publicKey,
      }),
    );
  } catch (error) {
    console.error('error', error);
    yield put(fetchKeyPairFailure());
  }
}

export function* fetchUserTeamsSaga() {
  try {
    const { data } = yield call(getUserTeams);

    if (data.length) {
      yield put(fetchUserTeamsSuccess(data.map(({ id }) => id)));
      // TODO: need fixes from BE
      const teamList = objectToArray(convertTeamsToEntity(data));
      yield all(teamList.map(team => call(addTeamsBatch, team)));
      const currentTeamId = yield select(currentTeamIdSelector);
      put(setCurrentTeamId(currentTeamId || data[0].id));
    }
  } catch (error) {
    console.error('error', error);
    yield put(fetchUserTeamsFailure());
  }
}

export function* logoutSaga() {
  try {
    yield call(postLogout);
    yield call(removeCookieValue, 'token');
    yield call(removeCookieValue, 'share');
    yield call(clearStorage);
    yield call(Router.push, ROUTES.SIGN_IN);
  } catch (error) {
    console.error('error', error);
  }
}

export default function* userSagas() {
  yield takeLatest(FETCH_USER_SELF_REQUEST, fetchUserSelfSaga);
  yield takeLatest(FETCH_KEY_PAIR_REQUEST, fetchKeyPairSaga);
  yield takeLatest(FETCH_USER_TEAMS_REQUEST, fetchUserTeamsSaga);
  yield takeLatest(LOGOUT, logoutSaga);
}
