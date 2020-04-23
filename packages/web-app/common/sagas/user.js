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
} from 'common/actions/user';
import { addTeamsBatch } from 'common/actions/entities/team';
import { addMembersBatch } from 'common/actions/entities/member';
import { currentTeamIdSelector } from 'common/selectors/user';
import { convertTeamsToEntity } from 'common/normalizers/normalizers';
import { getUserSelf, getKeys, getUserTeams } from 'common/api';

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
    // eslint-disable-next-line
    yield call(() => (window.location.href = '/logout'));
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
