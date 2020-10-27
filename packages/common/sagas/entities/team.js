/* eslint-disable no-unused-vars */
import { put, call, takeLatest, select, all } from 'redux-saga/effects';
import {
  FETCH_TEAMS_REQUEST,
  FETCH_TEAM_REQUEST,
  CREATE_TEAM_REQUEST,
  EDIT_TEAM_REQUEST,
  REMOVE_TEAM_REQUEST,
  UPDATE_TEAM_MEMBER_ROLE_REQUEST,
  ADD_TEAM_MEMBERS_BATCH_REQUEST,
  REMOVE_TEAM_MEMBER_REQUEST,
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
  updateTeamMemberRoleSuccess,
  updateTeamMemberRoleFailure,
  addTeamMembersBatchSuccess,
  addTeamMembersBatchFailure,
  removeTeamMemberSuccess,
  removeTeamMemberFailure,
  addTeamsBatch,
  togglePinTeamSuccess,
  togglePinTeamFailure,
} from '@caesar/common/actions/entities/team';
import {
  addMembersBatch,
  removeTeamFromMember,
  removeTeamFromMembersBatch,
} from '@caesar/common/actions/entities/member';
import {
  setCurrentTeamId,
  leaveTeam,
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
  updateTeamMember,
  deleteTeamMember,
  postCreateVault,
  postAddTeamMemberBatch,
  pinTeam,
} from '@caesar/common/api';
import { fetchUsersSaga } from '@caesar/common/sagas/entities/user';
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
import {
  TEAM_ROLES,
  ENTITY_TYPE,
  NOOP_NOTIFICATION,
  TEAM_TYPE,
} from '@caesar/common/constants';
import { updateGlobalNotification } from '@caesar/common/actions/application';
import { finishIsLoading } from '@caesar/common/actions/workflow';
import {
  createKeyPair,
  encryptSecret,
  generateKeyPair,
} from '@caesar/common/sagas/entities/item';
import { teamKeyPairSelector } from '@caesar/common/selectors/keystore';
import {
  memberAdminsSelector,
  memberSelector,
} from '../../selectors/entities/member';
import { usersBatchSelector } from '../../selectors/entities/user';
import { addTeamKeyPairBatch } from '../../actions/keystore';
import { createVaultSuccess } from '../../actions/entities/vault';

export function* fetchTeamsSaga() {
  try {
    const { data: teamList } = yield call(getTeams);
    const { teams, members } = convertTeamNodesToEntities(teamList);

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
      yield put(leaveTeam(teamId));
    }

    if (teamId === currentTeamId) {
      yield setCurrentTeamId(TEAM_TYPE.PERSONAL);
    }

    yield put(removeTeamSuccess(teamId));
    if (team?.users) {
      yield put(
        removeTeamFromMembersBatch(teamId, team.users?.map(({ id }) => id)),
      );
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
function* encryptMemberTeamKey({ member, keypair }) {
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
export function* addMemberToTeamListsBatchSaga({ payload: { teamId, users } }) {
  try {
    const keypair = yield select(teamKeyPairSelector, { teamId });
    const userIds = users.map(user => user.id);
    // Domain users
    // TODO: Invite unregistered users
    const newUsers = yield select(usersBatchSelector, { userIds });

    const postDataSagas = newUsers.map(member =>
      call(encryptMemberTeamKey, { member, keypair }),
    );
    const postData = yield all(postDataSagas);

    const { data: serverMembers } = yield call(postAddTeamMemberBatch, {
      members: postData,
      teamId,
    });

    const membersById = convertMembersToEntity(serverMembers);
    yield put(addTeamMembersBatchSuccess(teamId, membersById));
    yield put(addMembersBatch(membersById));

    yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(addTeamMembersBatchFailure());
  }
}

export function* createTeamSaga({
  payload: { title, icon, ownerId = null },
  meta: { handleCloseModal, setSubmitting, setErrors },
}) {
  try {
    const currentUser = yield select(currentUserDataSelector);
    const userId = ownerId || currentUser.id;

    const owner = yield select(memberSelector, { memberId: userId });
    const { publicKey } = owner;

    // Get updates
    yield call(fetchUsersSaga);
    const adminMembers = yield select(memberAdminsSelector);
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
          members: adminsToInvite,
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

    yield put(editTeamSuccess({ ...team, __type: ENTITY_TYPE.TEAM }));
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

export function* updateTeamMemberRoleSaga({
  payload: { teamId, userId, role },
}) {
  try {
    yield call(updateTeamMember, { teamId, userId, role });

    yield put(updateTeamMemberRoleSuccess(teamId, userId, role));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(updateTeamMemberRoleFailure());
  }
}

export function* removeTeamMemberSaga({ payload: { teamId, userId } }) {
  try {
    yield call(deleteTeamMember, { teamId, userId });
    yield put(removeTeamMemberSuccess(teamId, userId));
    yield put(removeTeamFromMember(teamId, userId));

    yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(removeTeamMemberFailure());
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
  yield takeLatest(UPDATE_TEAM_MEMBER_ROLE_REQUEST, updateTeamMemberRoleSaga);
  yield takeLatest(
    ADD_TEAM_MEMBERS_BATCH_REQUEST,
    addMemberToTeamListsBatchSaga,
  );
  yield takeLatest(REMOVE_TEAM_MEMBER_REQUEST, removeTeamMemberSaga);
  yield takeLatest(TOGGLE_PIN_TEAM_REQUEST, togglePinTeamSaga);
}
