import { put, call, takeLatest, select, all, fork } from 'redux-saga/effects';
import {
  FETCH_TEAMS_REQUEST,
  FETCH_TEAM_REQUEST,
  CREATE_TEAM_REQUEST,
  REMOVE_TEAM_REQUEST,
  UPDATE_TEAM_MEMBER_ROLE_REQUEST,
  ADD_TEAM_MEMBERS_BATCH_REQUEST,
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
  addTeamMembersBatchSuccess,
  addTeamMembersBatchFailure,
  removeTeamMemberSuccess,
  removeTeamMemberFailure,
  addTeamMember,
} from 'common/actions/entities/team';
import { createChildItemBatchSaga } from 'common/sagas/entities/childItem';
import { fetchTeamMembersSaga } from 'common/sagas/entities/member';
import {
  addTeamToMember,
  addTeamToMembersBatch,
  removeTeamFromMember,
  removeTeamFromMembersBatch,
} from 'common/actions/entities/member';
import { setCurrentTeamId, leaveTeam, joinTeam } from 'common/actions/user';
import { teamSelector } from 'common/selectors/entities/team';
import { teamItemListSelector } from 'common/selectors/entities/item';
import {
  currentTeamIdSelector,
  userDataSelector,
  userTeamIdsSelector,
} from 'common/selectors/user';
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
import { COMMANDS_ROLES, TEAM_ENTITY_TYPE } from 'common/constants';
import {
  prepareUsersForSharing,
  resolveSharingConflicts,
} from 'common/sagas/common/share';
import { inviteNewMemberBatchSaga } from 'common/sagas/common/invite';

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

    yield put(createTeamSuccess({ ...data, __type: TEAM_ENTITY_TYPE }));
    yield put(addTeamToMember(data.id, user.id));
    yield put(addTeamMember(data.id, user.id, COMMANDS_ROLES.USER_ROLE_ADMIN));
    yield put(joinTeam(data.id));
  } catch (error) {
    console.log(error);
    yield put(createTeamFailure());
  }
}

export function* removeTeamSaga({ payload: { teamId } }) {
  try {
    const team = yield select(teamSelector, { teamId });
    const userTeamIds = yield select(userTeamIdsSelector);
    const currentTeamId = yield select(currentTeamIdSelector);

    yield call(deleteTeam, teamId);

    if (userTeamIds.includes(teamId)) {
      yield put(leaveTeam(teamId));
    }

    if (teamId === currentTeamId) {
      yield setCurrentTeamId(null);
    }

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

export function* addTeamMembersBatchSaga({ payload: { teamId, members } }) {
  try {
    const { allMembers, newMembers } = yield call(prepareUsersForSharing, {
      payload: { members, teamIds: [] },
    });

    yield fork(inviteNewMemberBatchSaga, { payload: { members: newMembers } });

    const teamItemList = yield select(teamItemListSelector, { teamId });

    const itemUserPairs = yield call(resolveSharingConflicts, {
      payload: { items: teamItemList, members: allMembers },
    });

    const invitedMemberIds = allMembers.map(({ id }) => id);
    const invitedMembersWithCommandRole = allMembers.map(member => ({
      ...member,
      role: COMMANDS_ROLES.USER_ROLE_MEMBER,
    }));

    // TODO: change it on batch
    yield all(
      invitedMembersWithCommandRole.map(({ id: userId, role }) =>
        call(postAddTeamMember, { teamId, userId, role }),
      ),
    );

    // TODO: add invite for members new or not new i dunno

    yield put(
      addTeamMembersBatchSuccess(teamId, invitedMembersWithCommandRole),
    );
    yield put(addTeamToMembersBatch(teamId, invitedMemberIds));

    yield fork(createChildItemBatchSaga, {
      payload: { itemUserPairs },
    });
  } catch (error) {
    console.log(error);
    yield put(addTeamMembersBatchFailure());
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
  yield takeLatest(ADD_TEAM_MEMBERS_BATCH_REQUEST, addTeamMembersBatchSaga);
  yield takeLatest(REMOVE_TEAM_MEMBER_REQUEST, removeTeamMemberSaga);
}
