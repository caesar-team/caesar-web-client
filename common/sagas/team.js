import { put, call, takeLatest } from 'redux-saga/effects';
import {
  FETCH_TEAMS_REQUEST,
  CREATE_TEAM_REQUEST,
  fetchTeamsSuccess,
  fetchTeamsFailure,
  createTeamSuccess,
  createTeamFailure,
} from 'common/actions/team';
import { getTeams, postCreateTeam } from 'common/api';
import { convertTeamsToEntity } from 'common/normalizers/normalizers';

export function* fetchTeamsSaga() {
  try {
    const { data } = yield call(getTeams);

    yield put(fetchTeamsSuccess(convertTeamsToEntity(data)));
  } catch (error) {
    console.log(error);
    yield put(fetchTeamsFailure());
  }
}

export function* createTeamSaga({ payload: { name, icon } }) {
  try {
    const { data } = yield call(postCreateTeam, { name, icon });

    yield put(createTeamSuccess(data));
  } catch (error) {
    console.log(error);
    yield put(createTeamFailure());
  }
}

export default function* teamSagas() {
  yield takeLatest(FETCH_TEAMS_REQUEST, fetchTeamsSaga);
  yield takeLatest(CREATE_TEAM_REQUEST, createTeamSaga);
}
