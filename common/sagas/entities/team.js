import { put, call, takeLatest, select, all } from 'redux-saga/effects';
import {
  FETCH_TEAMS_REQUEST,
  FETCH_TEAM_REQUEST,
  CREATE_TEAM_REQUEST,
  REMOVE_TEAM_REQUEST,
  UPDATE_TEAM_MEMBER_ROLE_REQUEST,
  ADD_TEAM_MEMBER_REQUEST,
  REMOVE_TEAM_MEMBER_REQUEST,
  fetchTeamsSuccess,
  fetchTeamsFailure,
  fetchTeamSuccess,
  fetchTeamFailure,
  createTeamSuccess,
  createTeamFailure,
  removeTeamSuccess,
  removeTeamFailure,
  updateTeamMemberRoleSuccess,
  updateTeamMemberRoleFailure,
  addTeamMemberSuccess,
  addTeamMemberFailure,
  removeTeamMemberSuccess,
  removeTeamMemberFailure,
  addTeamMember,
} from 'common/actions/entities/team';
import { fetchTeamMembersSaga } from 'common/sagas/entities/member';
import {
  addTeamToMember,
  removeTeamFromMember,
  removeTeamFromMembersBatch,
} from 'common/actions/entities/member';
import { setCurrentTeamId } from 'common/actions/user';
import { teamSelector } from 'common/selectors/entities/team';
import { currentTeamIdSelector, userDataSelector } from 'common/selectors/user';
import {
  getTeams,
  postCreateTeam,
  deleteTeam,
  getTeam,
  updateTeamMember,
  postAddTeamMember,
  deleteTeamMember,
} from 'common/api';
import { convertTeamsToEntity } from 'common/normalizers/normalizers';
import { COMMANDS_ROLES } from 'common/constants';

export function* fetchTeamsSaga() {
  try {
    const { data } = yield call(getTeams);

    yield put(fetchTeamsSuccess(convertTeamsToEntity(data)));

    const currentTeamId = yield select(currentTeamIdSelector);

    if (data.length && !currentTeamId) {
      yield put(setCurrentTeamId(data[0].id));
    }

    yield all(
      data.map(team =>
        call(fetchTeamMembersSaga, { payload: { teamId: team.id } }),
      ),
    );
  } catch (error) {
    console.log(error);
    yield put(fetchTeamsFailure());
  }
}

export function* fetchTeamSaga({ payload: { teamId } }) {
  try {
    const { data } = yield call(getTeam, teamId);

    yield put(fetchTeamSuccess(data));
  } catch (error) {
    console.log(error);
    yield put(fetchTeamFailure());
  }
}

export function* createTeamSaga({ payload: { title, icon } }) {
  try {
    const { data } = yield call(postCreateTeam, { title, icon });

    const user = yield select(userDataSelector);

    yield put(createTeamSuccess(data));
    yield put(addTeamToMember(data.id, user.id));
    yield put(addTeamMember(data.id, user.id, COMMANDS_ROLES.USER_ROLE_ADMIN));
  } catch (error) {
    console.log(error);
    yield put(createTeamFailure());
  }
}

export function* removeTeamSaga({ payload: { teamId } }) {
  try {
    const team = yield select(teamSelector, { teamId });

    yield call(deleteTeam, teamId);

    yield put(removeTeamSuccess(teamId));
    yield put(
      removeTeamFromMembersBatch(teamId, team.users.map(({ id }) => id)),
    );
  } catch (error) {
    console.log(error);
    yield put(removeTeamFailure());
  }
}

export function* updateTeamMemberRoleSaga({
  payload: { teamId, userId, role },
}) {
  try {
    yield call(updateTeamMember, { teamId, userId, role });

    yield put(updateTeamMemberRoleSuccess(teamId, userId, role));
  } catch (error) {
    console.log(error);
    yield put(updateTeamMemberRoleFailure());
  }
}

export function* addTeamMemberSaga({ payload: { teamId, userId, role } }) {
  try {
    yield call(postAddTeamMember, { teamId, userId, role });
    yield put(addTeamMemberSuccess(teamId, userId, role));
    yield put(addTeamToMember(teamId, userId));
  } catch (error) {
    console.log(error);
    yield put(addTeamMemberFailure());
  }
}

export function* removeTeamMemberSaga({ payload: { teamId, userId } }) {
  try {
    yield call(deleteTeamMember, { teamId, userId });
    yield put(removeTeamMemberSuccess(teamId, userId));
    yield put(removeTeamFromMember(teamId, userId));
  } catch (error) {
    console.log(error);
    yield put(removeTeamMemberFailure());
  }
}

export default function* teamSagas() {
  yield takeLatest(FETCH_TEAMS_REQUEST, fetchTeamsSaga);
  yield takeLatest(FETCH_TEAM_REQUEST, fetchTeamSaga);
  yield takeLatest(CREATE_TEAM_REQUEST, createTeamSaga);
  yield takeLatest(REMOVE_TEAM_REQUEST, removeTeamSaga);
  yield takeLatest(UPDATE_TEAM_MEMBER_ROLE_REQUEST, updateTeamMemberRoleSaga);
  yield takeLatest(ADD_TEAM_MEMBER_REQUEST, addTeamMemberSaga);
  yield takeLatest(REMOVE_TEAM_MEMBER_REQUEST, removeTeamMemberSaga);
}
