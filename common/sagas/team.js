import { put, call, takeLatest } from 'redux-saga/effects';
import {
  FETCH_TEAMS_REQUEST,
  CREATE_TEAM_REQUEST,
  REMOVE_TEAM_REQUEST,
  fetchTeamsSuccess,
  fetchTeamsFailure,
  createTeamSuccess,
  createTeamFailure,
  removeTeamSuccess,
  removeTeamFailure,
} from 'common/actions/team';
import {
  getUsers,
  postNewUser,
  getPublicKeyByEmailBatch,
  postNewUserBatch,
} from 'common/api';
import { convertTeamsToEntity } from 'common/normalizers/normalizers';

export function* fetchTeamsSaga() {
  try {
    const { data } = yield call(getUsers);

    yield put(fetchTeamsSuccess(convertTeamsToEntity(data)));
  } catch (e) {
    yield put(fetchTeamsFailure());
  }
}

export function* createTeamSaga() {
  try {
    const { data } = yield call(getUsers);

    yield put(fetchTeamsSuccess(convertTeamsToEntity(data)));
  } catch (e) {
    yield put(fetchTeamsFailure());
  }
}

export function* removeTeamSaga() {
  try {
    const { data } = yield call(getUsers);

    yield put(fetchTeamsSuccess(convertTeamsToEntity(data)));
  } catch (e) {
    yield put(fetchTeamsFailure());
  }
}

export default function* teamSagas() {
  yield takeLatest(FETCH_TEAMS_REQUEST, fetchTeamsSaga);
  yield takeLatest(CREATE_TEAM_REQUEST, createTeamSaga);
  yield takeLatest(REMOVE_TEAM_REQUEST, removeTeamSaga);
}
