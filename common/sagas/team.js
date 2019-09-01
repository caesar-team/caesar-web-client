import { put, call, takeLatest } from 'redux-saga/effects';
import {
  FETCH_TEAMS_REQUEST,
  fetchTeamsSuccess,
  fetchTeamsFailure,
} from 'common/actions/team';
import { getTeams } from 'common/api';
import { convertTeamsToEntity } from 'common/normalizers/normalizers';

export function* fetchTeamsSaga() {
  try {
    const { data } = yield call(getTeams);

    yield put(fetchTeamsSuccess(convertTeamsToEntity(data)));
  } catch (e) {
    yield put(fetchTeamsFailure());
  }
}

export default function* teamSagas() {
  yield takeLatest(FETCH_TEAMS_REQUEST, fetchTeamsSaga);
}
