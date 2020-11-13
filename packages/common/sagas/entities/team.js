import { put, call, takeLatest, select } from 'redux-saga/effects';
import {
  FETCH_TEAMS_REQUEST,
  FETCH_TEAM_REQUEST,
  CREATE_TEAM_REQUEST,
  EDIT_TEAM_REQUEST,
  REMOVE_TEAM_REQUEST,
  CREATE_TEAM_KEYS_REQUEST,
  TOGGLE_PIN_TEAM_REQUEST,
  fetchTeamsSuccess,
  fetchTeamsFailure,
  fetchTeamSuccess,
  fetchTeamFailure,
  createTeamFailure,
  editTeamSuccess,
  editTeamFailure,
  removeTeamSuccess,
  removeTeamFailure,
  addTeamsBatch,
  togglePinTeamSuccess,
  togglePinTeamFailure,
} from '@caesar/common/actions/entities/team';
import {
  addMembersBatch,
  removeTeamMembersBatch,
  addTeamMembersBatchSuccess,
} from '@caesar/common/actions/entities/member';
import {
  setCurrentTeamId,
  leaveTeamSuccess,
} from '@caesar/common/actions/currentUser';
import { teamSelector } from '@caesar/common/selectors/entities/team';
import {
  currentTeamIdSelector,
  currentUserDataSelector,
  currentUserTeamIdsSelector,
} from '@caesar/common/selectors/currentUser';
import {
  getTeams,
  editTeam,
  deleteTeam,
  getTeam,
  postCreateVault,
  pinTeam,
} from '@caesar/common/api';
import { fetchUsersSaga } from '@caesar/common/sagas/entities/user';
import { addMemberToTeamListsBatchSaga } from '@caesar/common/sagas/entities/member';
import {
  getServerErrorMessage,
  getServerErrors,
} from '@caesar/common/utils/error';
import {
  convertTeamsToEntity,
  convertTeamNodesToEntities,
  convertKeyPairToEntity,
  convertKeyPairToItemEntity,
  convertMembersToEntity,
} from '@caesar/common/normalizers/normalizers';
import { TEAM_ROLES, TEAM_TYPE } from '@caesar/common/constants';
import { updateGlobalNotification } from '@caesar/common/actions/application';
import { finishIsLoading } from '@caesar/common/actions/workflow';
import {
  createKeyPair,
  encryptSecret,
  generateKeyPair,
} from '@caesar/common/sagas/entities/item';
import {
  userSelector,
  userAdminsSelector,
} from '../../selectors/entities/user';
import { addTeamKeyPairBatch } from '../../actions/keystore';
import { createVaultSuccess } from '../../actions/entities/vault';
import { upperFirst } from '../../utils/string';

export function* fetchTeamsSaga() {
  try {
    const currentUserData = yield select(currentUserDataSelector);
    const personalTeam = {
      id: TEAM_TYPE.PERSONAL,
      title: upperFirst(TEAM_TYPE.PERSONAL),
      type: TEAM_TYPE.PERSONAL,
      icon: currentUserData?.avatar,
      email: currentUserData?.email,
      teamRole: TEAM_ROLES.ROLE_ADMIN,
      _links: currentUserData?._links,
    };
    const { data: teamList } = yield call(getTeams);
    const { teams, members } = convertTeamNodesToEntities([
      ...teamList,
      personalTeam,
    ]);

    yield put(fetchTeamsSuccess(teams));
    yield put(addMembersBatch(members));
    yield put(finishIsLoading());
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(fetchTeamsFailure());
  }
}

export function* fetchTeamSaga({ payload: { teamId } }) {
  try {
    const { data: team } = yield call(getTeam, teamId);

    const teamsById = convertTeamsToEntity([team]);

    yield put(fetchTeamSuccess(teamsById[teamId]));
    yield put(finishIsLoading());
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(fetchTeamFailure());
  }
}

export function* removeTeamSaga({ payload: { teamId } }) {
  try {
    const team = yield select(teamSelector, { teamId });
    const userTeamIds = yield select(currentUserTeamIdsSelector);
    const currentTeamId = yield select(currentTeamIdSelector);

    yield call(deleteTeam, teamId);

    if (userTeamIds.includes(teamId)) {
      yield put(leaveTeamSuccess(teamId));
    }

    if (teamId === currentTeamId) {
      yield setCurrentTeamId(TEAM_TYPE.PERSONAL);
    }

    yield put(removeTeamSuccess(teamId));
    if (team?.members) {
      yield put(removeTeamMembersBatch(team?.members));
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(removeTeamFailure());
  }
}

export function* createTeamKeyPairSaga({
  payload: { team, ownerId, publicKey },
}) {
  try {
    if (!publicKey || typeof publicKey === 'undefined') {
      // TODO: Bug fix: we lost the user default list and we need to restore it from the list api
      throw new Error('Fatal error: The publicKey not found.');
    }

    const keyPairsById = yield call(createKeyPair, {
      payload: {
        entityTeamId: team.id,
        publicKey,
        entityOwnerId: ownerId,
      },
    });

    yield put(addTeamKeyPairBatch(keyPairsById));

    const keyPair = Object.values(keyPairsById).shift();

    return keyPair;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    // Todo: need to remove all dependet entities when create team is failed
    yield put(createTeamFailure());

    return null;
  }
}

/* 
1. Get all public keys for the members
1a. If user doesn't exist then create a keypair & masterpassword for that user
2. Create a keypair clone from the team keypair per member
3. Create secrets (encrypted keypairs) from the members keypairs
4. Save all secrets to the server
5. Add the members to the team
*/
export function* encryptMemberTeamKey({ member, keypair }) {
  const { id: userId, publicKey } = member;

  const itemKeyPair = Object.values(
    convertKeyPairToItemEntity([keypair]),
  ).shift();

  const secret = yield call(encryptSecret, {
    item: itemKeyPair,
    publicKey,
  });
  const teamRole = member?.domainRoles?.includes(TEAM_ROLES.ROLE_ADMIN)
    ? TEAM_ROLES.ROLE_ADMIN
    : TEAM_ROLES.ROLE_MEMBER;

  return {
    userId,
    secret,
    teamRole,
  };
}

export function* createTeamSaga({
  payload: { title, icon, ownerId = null },
  meta: { handleCloseModal, setSubmitting, setErrors },
}) {
  try {
    const currentUser = yield select(currentUserDataSelector);
    const userId = ownerId || currentUser.id;

    const owner = yield select(userSelector, { userId });
    const { publicKey } = owner;

    // Get updates
    yield call(fetchUsersSaga);
    const adminMembers = yield select(userAdminsSelector);
    // Gathering admins except current
    const adminsToInvite = adminMembers.filter(({ id }) => id !== userId);

    const team = {
      title,
      icon,
    };

    const teamKeyPair = yield call(generateKeyPair, {
      name: title,
    });

    if (!teamKeyPair) {
      throw new Error(`Can't create the team with the title: ${title}`);
    }

    const encryptedKeypair = yield call(encryptSecret, {
      item: teamKeyPair,
      publicKey,
    });

    const serverPayload = {
      team,
      keypair: {
        secret: encryptedKeypair,
      },
    };

    const {
      data: { team: serverTeam, keypair: serverKeypair },
    } = yield call(postCreateVault, serverPayload);

    // TODO: [Refactoring] The calls for the sagas below should be refactor to the vault reduser of the createVaultSuccess event
    if (serverTeam?.id) {
      const teamsById = convertTeamsToEntity([serverTeam]);
      yield put(addTeamsBatch(teamsById));
    }

    if (serverKeypair?.id) {
      const keyPairsById = convertKeyPairToEntity(
        [
          {
            ...serverKeypair,
            ...teamKeyPair,
          },
        ],
        'teamId',
      );

      yield put(addTeamKeyPairBatch(keyPairsById));
    }

    if (serverTeam?.members.length > 0) {
      const membersById = convertMembersToEntity(serverTeam?.members);

      yield put(addTeamMembersBatchSuccess(membersById));
    }

    yield put(
      createVaultSuccess({
        team: serverTeam,
        keypair: serverKeypair,
      }),
    );

    if (adminsToInvite.length > 0 && serverTeam?.id) {
      yield call(addMemberToTeamListsBatchSaga, {
        payload: {
          teamId: serverTeam?.id,
          users: adminsToInvite,
        },
      });
    }

    yield call(setSubmitting, false);
    yield call(handleCloseModal);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    const errors = getServerErrors(error) || error;

    yield call(setErrors, { form: errors });
    yield call(setSubmitting, false);
    yield put(createTeamFailure());
  }
}

export function* editTeamSaga({
  payload: { teamId, title, icon },
  meta: { handleCloseModal, setSubmitting, setErrors },
}) {
  try {
    const { data: team } = yield call(editTeam, teamId, { title, icon });
    const teamsById = convertTeamsToEntity([team]);

    yield put(editTeamSuccess({ ...team, ...teamsById[team.id] }));
    yield call(setSubmitting, false);
    yield call(handleCloseModal);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    const errors = getServerErrors(error);

    yield call(setErrors, { form: errors });
    yield call(setSubmitting, false);
    yield put(editTeamFailure());
  }
}

export function* togglePinTeamSaga({ payload: { teamId, shouldPinned } }) {
  try {
    const {
      data: { pinned },
    } = yield call(pinTeam, teamId, shouldPinned);

    yield put(togglePinTeamSuccess(teamId, pinned));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(togglePinTeamFailure());
  }
}

export default function* teamSagas() {
  yield takeLatest(FETCH_TEAMS_REQUEST, fetchTeamsSaga);
  yield takeLatest(FETCH_TEAM_REQUEST, fetchTeamSaga);
  yield takeLatest(CREATE_TEAM_REQUEST, createTeamSaga);
  yield takeLatest(CREATE_TEAM_KEYS_REQUEST, createTeamKeyPairSaga);
  yield takeLatest(EDIT_TEAM_REQUEST, editTeamSaga);
  yield takeLatest(REMOVE_TEAM_REQUEST, removeTeamSaga);
  yield takeLatest(TOGGLE_PIN_TEAM_REQUEST, togglePinTeamSaga);
}
