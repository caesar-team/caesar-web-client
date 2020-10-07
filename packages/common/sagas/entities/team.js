/* eslint-disable no-unused-vars */
import { put, call, takeLatest, select, all, fork } from 'redux-saga/effects';
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
} from '@caesar/common/actions/entities/team';
import { createChildItemBatchSaga } from '@caesar/common/sagas/entities/childItem';
import { fetchTeamMembersSaga } from '@caesar/common/sagas/entities/member';
import {
  addTeamToMembersTeamsListBatch,
  removeTeamFromMember,
  removeTeamFromMembersBatch,
} from '@caesar/common/actions/entities/member';
import { removeChildItemsBatchFromItems } from '@caesar/common/actions/entities/item';
import { removeChildItemsBatch } from '@caesar/common/actions/entities/childItem';
import { setCurrentTeamId, leaveTeam } from '@caesar/common/actions/user';
import { teamSelector } from '@caesar/common/selectors/entities/team';
import { teamItemListSelector } from '@caesar/common/selectors/entities/item';
import {
  currentTeamIdSelector,
  userDataSelector,
  userTeamIdsSelector,
} from '@caesar/common/selectors/user';
import {
  getTeams,
  editTeam,
  deleteTeam,
  getTeam,
  updateTeamMember,
  postAddTeamMember,
  deleteTeamMember,
  postCreateVault,
} from '@caesar/common/api';
import {
  getServerErrorMessage,
  getServerErrors,
} from '@caesar/common/utils/error';
import {
  convertTeamsToEntity,
  convertKeyPairToEntity,
} from '@caesar/common/normalizers/normalizers';
import { createPermissionsFromLinks } from '@caesar/common/utils/createPermissionsFromLinks';
import {
  COMMANDS_ROLES,
  ENTITY_TYPE,
  NOOP_NOTIFICATION,
  TEAM_TYPE,
} from '@caesar/common/constants';
import {
  prepareUsersForSharing,
  getItemUserPairs,
} from '@caesar/common/sagas/common/share';
import { inviteNewMemberBatchSaga } from '@caesar/common/sagas/common/invite';
import { createChildItemsFilterSelector } from '@caesar/common/selectors/entities/childItem';
import { updateGlobalNotification } from '@caesar/common/actions/application';
import {
  encryptSecret,
  generateTeamKeyPair,
  saveItemSaga,
} from '@caesar/common/sagas/entities/item';
import { teamKeyPairSelector } from '@caesar/common/selectors/keystore';
import { memberSelector } from '../../selectors/entities/member';
import { addTeamKeyPairBatch } from '../../actions/keystore';
import { createVaultSuccess } from '../../actions/entities/vault';
import { teamDefaultListSelector } from '../../selectors/entities/list';

export function* fetchTeamsSaga() {
  try {
    const { data: teamList } = yield call(getTeams);

    yield put(fetchTeamsSuccess(convertTeamsToEntity(teamList)));

    const currentTeamId = yield select(currentTeamIdSelector);

    if (teamList.length && !currentTeamId) {
      yield put(setCurrentTeamId(teamList[0].id));
    }

    yield all(
      teamList.map(team =>
        call(fetchTeamMembersSaga, { payload: { teamId: team.id } }),
      ),
    );
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
    const { data } = yield call(getTeam, teamId);

    yield put(fetchTeamSuccess(data));
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
    const userTeamIds = yield select(userTeamIdsSelector);
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

export function* createTeamKeyPairSaga({ payload: { team, publicKey } }) {
  try {
    if (!publicKey || typeof publicKey === 'undefined') {
      // TODO: Bug fix: we lost the user default list and we need to restore it from the list api
      throw new Error('Fatal error: The publicKey not found.');
    }

    const teamKeyPair = yield call(generateTeamKeyPair, {
      payload: {
        name: team.name,
        publicKey,
      },
    });

    const { id: listId } = yield select(teamDefaultListSelector, {
      teamId: team.id,
    });

    const serverKeypairItem = yield call(saveItemSaga, {
      item: {
        teamId: team.id,
        listId,
        ...teamKeyPair,
      },
      publicKey,
    });

    const keyPairsById = convertKeyPairToEntity([serverKeypairItem]);
    yield put(addTeamKeyPairBatch(keyPairsById));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    // Todo: need to remove all dependet entities when create team is failed
    yield put(createTeamFailure());
  }
}

export function* createTeamSaga({
  payload: { title, icon, ownerId = null },
  meta: { handleCloseModal, setSubmitting, setErrors },
}) {
  try {
    const currentUser = yield select(userDataSelector);
    const userId = ownerId || currentUser.id;

    const owner = yield select(memberSelector, { memberId: userId });
    const { publicKey } = owner;

    const team = {
      title,
      icon,
    };

    const teamKeyPair = yield call(createTeamKeyPairSaga, {
      payload: { teamName: encodeURIComponent(title), publicKey },
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
      const keyPairsById = convertKeyPairToEntity([serverKeypair]);
      yield put(addTeamKeyPairBatch(keyPairsById));
    }

    yield put(
      createVaultSuccess({
        team: serverTeam,
        keypair: serverKeypair,
      }),
    );

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

export function* addMemberToTeamListsBatchSaga({
  payload: { teamId, members },
}) {
  try {
    const preparedMembers = yield call(prepareUsersForSharing, members);

    const teamMembers = preparedMembers.map(member => ({ ...member, teamId }));
    const newMembers = preparedMembers.filter(({ isNew }) => isNew);

    if (newMembers.length > 0) {
      yield fork(inviteNewMemberBatchSaga, {
        payload: { members: newMembers },
      });
    }

    const teamItemList = yield select(teamItemListSelector, { teamId });
    const teamSystemItem = yield select(teamKeyPairSelector, { teamId });

    teamItemList.push(teamSystemItem?.raw);
    const itemUserPairs = yield call(getItemUserPairs, {
      items: teamItemList,
      members: teamMembers,
    });

    const invitedMemberIds = teamMembers.map(({ id }) => id);
    const invitedMembersWithCommandRole = teamMembers.map(member => ({
      ...member,
      role: COMMANDS_ROLES.USER_ROLE_MEMBER,
    }));

    const promises = invitedMembersWithCommandRole.map(({ id: userId, role }) =>
      postAddTeamMember({ teamId, userId, role }),
    );

    const invitedMembersWithLinks = [];

    yield Promise.all(promises).then(result => {
      result.forEach(({ data }) => {
        invitedMembersWithLinks.push({
          email: data.email,
          id: data.id,
          isNew: false,
          publicKey: data.publicKey,
          role: data.role,
          teamId,
          _links: data._links,
          _permissions: createPermissionsFromLinks(data._links),
        });
      });
    });

    // TODO: add invite for members new or not new i dunno

    yield put(addTeamMembersBatchSuccess(teamId, invitedMembersWithLinks));
    yield put(addTeamToMembersTeamsListBatch(teamId, invitedMemberIds));

    if (itemUserPairs.length > 0) {
      yield fork(createChildItemBatchSaga, {
        payload: { itemUserPairs },
      });
    }

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

export function* removeTeamMemberSaga({ payload: { teamId, userId } }) {
  try {
    yield call(deleteTeamMember, { teamId, userId });
    yield put(removeTeamMemberSuccess(teamId, userId));
    yield put(removeTeamFromMember(teamId, userId));

    const childItemsFilterSelector = createChildItemsFilterSelector({
      teamId,
      userId,
    });

    const childItems = yield select(childItemsFilterSelector);

    const childItemIds = childItems.map(({ id }) => id);

    const originalItemIds = childItems.map(
      ({ originalItemId }) => originalItemId,
    );

    yield put(removeChildItemsBatch(childItemIds));
    yield put(removeChildItemsBatchFromItems(originalItemIds, childItemIds));

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
}
