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
  fetchTeamsSuccess,
  fetchTeamsFailure,
  fetchTeamSuccess,
  fetchTeamFailure,
  createTeamSuccess,
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
  addMemberToTeamList,
} from '@caesar/common/actions/entities/team';
import { createChildItemBatchSaga } from '@caesar/common/sagas/entities/childItem';
import { fetchTeamMembersSaga } from '@caesar/common/sagas/entities/member';
import {
  addTeamToMemberTeamsList,
  addTeamToMembersTeamsListBatch,
  removeTeamFromMember,
  removeTeamFromMembersBatch,
} from '@caesar/common/actions/entities/member';
import {
  removeChildItemsBatchFromItems,
  createItemRequest,
} from '@caesar/common/actions/entities/item';
import { removeChildItemsBatch } from '@caesar/common/actions/entities/childItem';
import {
  setCurrentTeamId,
  leaveTeam,
  addMemberToTeam,
} from '@caesar/common/actions/user';
import { teamSelector } from '@caesar/common/selectors/entities/team';
import { teamItemListSelector } from '@caesar/common/selectors/entities/item';
import {
  currentTeamIdSelector,
  userDataSelector,
  userTeamIdsSelector,
  userPersonalDefaultListIdSelector,
} from '@caesar/common/selectors/user';
import {
  getTeams,
  postCreateTeam,
  editTeam,
  deleteTeam,
  getTeam,
  updateTeamMember,
  postAddTeamMember,
  deleteTeamMember,
} from '@caesar/common/api';
import { getServerErrorMessage } from '@caesar/common/utils/error';
import { convertTeamsToEntity } from '@caesar/common/normalizers/normalizers';
import {
  COMMANDS_ROLES,
  ENTITY_TYPE,
  NOOP_NOTIFICATION,
  ITEM_TYPE,
  TEAM_TYPE,
} from '@caesar/common/constants';
import {
  prepareUsersForSharing,
  getItemUserPairs,
} from '@caesar/common/sagas/common/share';
import { inviteNewMemberBatchSaga } from '@caesar/common/sagas/common/invite';
import { createChildItemsFilterSelector } from '@caesar/common/selectors/entities/childItem';
import { updateGlobalNotification } from '@caesar/common/actions/application';
import { generateKeys } from '@caesar/common/utils/key';
import { passwordGenerator } from '@caesar/common/utils/passwordGenerator';
import {
  generateSystemItemEmail,
  generateSystemItemName,
} from '@caesar/common/utils/item';
import { teamKeyPairSelector } from '@caesar/common/selectors/keyStore';

export function* generateTeamSystemItem(teamId) {
  const userPersonalDefaultListId = yield select(
    userPersonalDefaultListIdSelector,
  );
  const masterPassword = yield call(passwordGenerator);
  const systemTeamEmail = yield call(generateSystemItemEmail, teamId);

  const { publicKey, privateKey } = yield call(generateKeys, masterPassword, [
    systemTeamEmail,
  ]);

  const systemItemData = {
    type: ITEM_TYPE.SYSTEM,
    listId: userPersonalDefaultListId,
    attachments: [
      {
        name: 'publicKey',
        raw: publicKey,
      },
      {
        name: 'privateKey',
        raw: privateKey,
      },
    ],
    pass: masterPassword,
    name: generateSystemItemName(teamId),
  };

  return systemItemData;
}

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
    console.log(error);
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
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(fetchTeamFailure());
  }
}

export function* createTeamSaga({ payload: { title, icon } }) {
  try {
    const { data: team } = yield call(postCreateTeam, { title, icon });

    const user = yield select(userDataSelector);
    yield put(createTeamSuccess({ ...team, __type: ENTITY_TYPE.TEAM }));
    yield put(addTeamToMemberTeamsList(team.id, user.id));
    yield put(
      addMemberToTeamList(team.id, user.id, COMMANDS_ROLES.USER_ROLE_ADMIN),
    );
    yield put(addMemberToTeam(team.id));

    const systemItemData = yield call(generateTeamSystemItem, team.id);

    yield put(createItemRequest(systemItemData));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(createTeamFailure());
  }
}

export function* editTeamSaga({ payload: { teamId, title, icon } }) {
  try {
    const { data: team } = yield call(editTeam, teamId, { title, icon });

    yield put(editTeamSuccess({ ...team, __type: ENTITY_TYPE.TEAM }));
  } catch (error) {
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(editTeamFailure());
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
    yield put(
      removeTeamFromMembersBatch(teamId, team.users.map(({ id }) => id)),
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
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
    // eslint-disable-next-line no-console
    console.log(error);
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

    teamItemList.push(teamSystemItem.raw);
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
      result.map(({ data }) => {
        invitedMembersWithLinks.push({
          email: data.email,
          id: data.id,
          isNew: false,
          publicKey: data.publicKey,
          role: data.role,
          teamId,
          _links: data._links,
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
    console.log(error);
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
    console.log(error);
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
  yield takeLatest(EDIT_TEAM_REQUEST, editTeamSaga);
  yield takeLatest(REMOVE_TEAM_REQUEST, removeTeamSaga);
  yield takeLatest(UPDATE_TEAM_MEMBER_ROLE_REQUEST, updateTeamMemberRoleSaga);
  yield takeLatest(
    ADD_TEAM_MEMBERS_BATCH_REQUEST,
    addMemberToTeamListsBatchSaga,
  );
  yield takeLatest(REMOVE_TEAM_MEMBER_REQUEST, removeTeamMemberSaga);
}
