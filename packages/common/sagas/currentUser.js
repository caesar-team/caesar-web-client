/* eslint-disable no-console */
import Router from 'next/router';
import { put, call, all, select, takeLatest } from 'redux-saga/effects';
import { difference } from 'lodash';
import {
  FETCH_USER_SELF_REQUEST,
  FETCH_KEY_PAIR_REQUEST,
  FETCH_USER_TEAMS_REQUEST,
  CHECK_USER_TEAMS,
  LOGOUT,
  fetchUserSelfSuccess,
  fetchUserSelfFailure,
  fetchKeyPairFailure,
  fetchUserTeamsSuccess,
  fetchUserTeamsFailure,
  LEAVE_TEAM_REQUEST,
  leaveTeamFailure,
  leaveTeamSuccess,
  setCurrentTeamId,
  setLastUpdatedUnixtime,
} from '@caesar/common/actions/currentUser';
import { addPersonalKeyPair } from '@caesar/common/actions/keystore';
import {
  updateGlobalNotification,
  resetStore,
} from '@caesar/common/actions/application';
import {
  setWorkInProgressListId,
  setWorkInProgressItem,
} from '@caesar/common/actions/workflow';
import { loadKeyPairsAndPersonalItems } from '@caesar/common/sagas/workflow';
import {
  currentUserTeamIdsSelector,
  currentTeamIdSelector,
} from '@caesar/common/selectors/currentUser';
import { editTeamSuccess } from '@caesar/common/actions/entities/team';
import { getServerErrorMessage } from '@caesar/common/utils/error';
import {
  getUserSelf,
  getKeys,
  getUserTeams,
  postLeaveTeam,
  postLogout,
} from '@caesar/common/api';
import { removeCookieValue, clearStorage } from '@caesar/common/utils/token';
import { ROUTES, TEAM_TYPE } from '@caesar/common/constants';
import {
  normalizeCurrentUser,
  convertTeamsToEntity,
} from '@caesar/common/normalizers/normalizers';
import { clearStateWhenLeaveTeam } from './entities/team';
import { resetDashboardWorkflow } from './workflow';

export function* checkIfUserWasKickedFromTeam(userTeamIdsFromRequest) {
  try {
    const userTeamIds = yield select(currentUserTeamIdsSelector);

    if (!userTeamIds) return;

    let validUserTeamIds = [];

    if (userTeamIdsFromRequest) {
      validUserTeamIds = userTeamIdsFromRequest;
    } else {
      const { data } = yield call(getUserTeams);

      validUserTeamIds = data.map(({ id }) => id);
    }

    const diff = difference(userTeamIds, validUserTeamIds);

    if (diff.length) {
      yield call(clearStateWhenLeaveTeam, { payload: { teamIds: diff } });

      yield all(diff.map(teamId => put(leaveTeamSuccess(teamId))));

      const currentTeamId = yield select(currentTeamIdSelector);

      if (diff.includes(currentTeamId)) {
        yield put(setCurrentTeamId(TEAM_TYPE.PERSONAL));
        yield put(setWorkInProgressListId(null));
        yield put(setWorkInProgressItem(null));
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

export function* checkIfUserWasAddedToTeam(userTeamIdsFromRequest) {
  try {
    const userTeamIds = yield select(currentUserTeamIdsSelector) || [];

    if (!userTeamIdsFromRequest) return;

    const diff = difference(userTeamIdsFromRequest, userTeamIds);

    if (!diff.length) return;

    yield put(setLastUpdatedUnixtime(null));
    yield call(loadKeyPairsAndPersonalItems);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

function* checkUserTeams({ payload: { userTeamIdsFromRequest } }) {
  try {
    yield call(checkIfUserWasKickedFromTeam, userTeamIdsFromRequest);
    yield call(checkIfUserWasAddedToTeam, userTeamIdsFromRequest);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

export function* fetchUserSelfSaga() {
  try {
    const { data: currentUser } = yield call(getUserSelf);

    yield call(checkUserTeams, {
      payload: { userTeamIdsFromRequest: currentUser?.teamIds },
    });
    yield put(fetchUserSelfSuccess(normalizeCurrentUser(currentUser)));
  } catch (error) {
    console.error('error', error);
    yield put(fetchUserSelfFailure());
  }
}

export function* fetchKeyPairSaga() {
  try {
    const { data } = yield call(getKeys);

    const keypair = {
      privateKey: data.encryptedPrivateKey,
      publicKey: data.publicKey,
    };
    yield put(addPersonalKeyPair(keypair));

    return keypair;
  } catch (error) {
    console.error('error', error);
    yield put(fetchKeyPairFailure());

    return null;
  }
}

export function* fetchUserTeamsSaga() {
  try {
    const { data } = yield call(getUserTeams);

    if (data.length) {
      yield put(fetchUserTeamsSuccess(data.map(({ id }) => id)));
    }
  } catch (error) {
    console.error('error', error);
    yield put(fetchUserTeamsFailure());
  }
}

export function* leaveTeamSaga({ payload: { teamId } }) {
  try {
    const { data: team } = yield call(postLeaveTeam, teamId);
    const teamsById = convertTeamsToEntity([team]);

    yield put(leaveTeamSuccess(teamId));
    yield put(editTeamSuccess(teamsById[team.id]));
    yield call(clearStateWhenLeaveTeam, { payload: { teamIds: [teamId] } });
    yield call(resetDashboardWorkflow, teamId);

    const {
      router: { route },
    } = Router;

    if (route === `${ROUTES.SETTINGS}${ROUTES.TEAM}/[id]`) {
      yield call(Router.push, ROUTES.SETTINGS + ROUTES.TEAM);
    }
  } catch (e) {
    yield put(updateGlobalNotification(getServerErrorMessage(e), false, true));
    yield put(leaveTeamFailure());
  }
}

export function* logoutSaga() {
  try {
    yield call(postLogout);
    yield call(removeCookieValue, 'token');
    // TODO: Need to identify if we use this 'share' cookie or not
    yield call(removeCookieValue, 'share');
    yield call(clearStorage);
    yield put(resetStore());
    yield call(Router.push, ROUTES.SIGN_IN);
  } catch (error) {
    console.error('error', error);
  }
}

export default function* currentUserSagas() {
  yield takeLatest(CHECK_USER_TEAMS, checkUserTeams);
  yield takeLatest(FETCH_USER_SELF_REQUEST, fetchUserSelfSaga);
  yield takeLatest(FETCH_KEY_PAIR_REQUEST, fetchKeyPairSaga);
  yield takeLatest(FETCH_USER_TEAMS_REQUEST, fetchUserTeamsSaga);
  yield takeLatest(LEAVE_TEAM_REQUEST, leaveTeamSaga);
  yield takeLatest(LOGOUT, logoutSaga);
}
