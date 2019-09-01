import { put, call, takeLatest, select } from 'redux-saga/effects';
import {
  FETCH_USER_SELF_REQUEST,
  FETCH_KEY_PAIR_REQUEST,
  FETCH_USER_TEAMS_REQUEST,
  SET_CURRENT_TEAM_ID,
  fetchUserSelfSuccess,
  fetchUserSelfFailure,
  fetchKeyPairSuccess,
  fetchKeyPairFailure,
  fetchUserTeamsSuccess,
  fetchUserTeamsFailure,
  setCurrentTeamId,
} from 'common/actions/user';
import { addTeamsBatch } from 'common/actions/team';
import { addMembersBatch } from 'common/actions/member';
import { currentTeamIdSelector } from 'common/selectors/user';
import { defaultTeamSelector } from 'common/selectors/team';
import { convertTeamsToEntity } from 'common/normalizers/normalizers';
import { getUserSelf, getKeys, getUserTeams } from 'common/api';
import { setCookieValue } from 'common/utils/token';

export function* fetchUserSelfSaga() {
  try {
    const { data: user } = yield call(getUserSelf);

    yield put(fetchUserSelfSuccess(user));
    yield put(addMembersBatch({ [user.id]: user }));
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

    yield put(fetchUserTeamsSuccess(data.map(({ id }) => id)));
    yield put(addTeamsBatch(convertTeamsToEntity(data)));

    const currentTeamId = yield select(currentTeamIdSelector);

    if (!currentTeamId) {
      const defaultTeam = yield select(defaultTeamSelector);

      yield put(setCurrentTeamId(defaultTeam.id));
    } else {
      // set again currentTeamId for teamId value in cookie, it's like continuation
      yield put(setCurrentTeamId(currentTeamId));
    }
  } catch (error) {
    console.log('error', error);
    yield put(fetchUserTeamsFailure());
  }
}

function* setCurrentTeamIdWatch({ payload: { teamId } }) {
  yield call(setCookieValue, 'teamId', teamId);
}

export default function* userSagas() {
  yield takeLatest(FETCH_USER_SELF_REQUEST, fetchUserSelfSaga);
  yield takeLatest(FETCH_KEY_PAIR_REQUEST, fetchKeyPairSaga);
  yield takeLatest(FETCH_USER_TEAMS_REQUEST, fetchUserTeamsSaga);
  yield takeLatest(SET_CURRENT_TEAM_ID, setCurrentTeamIdWatch);
}
