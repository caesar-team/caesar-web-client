/* eslint-disable no-console */
import Router from 'next/router';
import { put, call, takeLatest, select } from 'redux-saga/effects';
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
} from '@caesar/common/actions/currentUser';
import { addPersonalKeyPair } from '@caesar/common/actions/keystore';
import { addTeamsBatch } from '@caesar/common/actions/entities/team';
import { addMembersBatch } from '@caesar/common/actions/entities/member';
import { resetStore } from '@caesar/common/actions/application';
import { membersByIdSelector } from '@caesar/common/selectors/entities/member';
import { currentTeamIdSelector } from '@caesar/common/selectors/currentUser';
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

export function* fetchUserSelfSaga() {
  try {
    const { data: currentUser } = yield call(getUserSelf);
    const membersById = yield select(membersByIdSelector);

    // TODO: Move to normalizr
    const fixedUser = {
      ...membersById[currentUser.id],
      ...currentUser,
      _permissions: createPermissionsFromLinks(currentUser._links),
      teamIds: currentUser.teamIds || [],
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
      const teamsById = convertTeamsToEntity(data);

      yield put(addTeamsBatch(teamsById));

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
    yield put(resetStore());
    yield call(Router.push, ROUTES.SIGN_IN);
  } catch (error) {
    console.error('error', error);
  }
}

export default function* currentUserSagas() {
  yield takeLatest(FETCH_USER_SELF_REQUEST, fetchUserSelfSaga);
  yield takeLatest(FETCH_KEY_PAIR_REQUEST, fetchKeyPairSaga);
  yield takeLatest(FETCH_USER_TEAMS_REQUEST, fetchUserTeamsSaga);
  yield takeLatest(LOGOUT, logoutSaga);
}
