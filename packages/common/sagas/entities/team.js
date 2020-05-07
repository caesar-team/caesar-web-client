import {
  put,
  call,
  takeLatest,
  select,
  all,
  fork,
  take,
} from 'redux-saga/effects';
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
} from '@caesar/common/actions/entities/team';
import { createChildItemBatchSaga } from '@caesar/common/sagas/entities/childItem';
import { fetchTeamMembersSaga } from '@caesar/common/sagas/entities/member';
import {
  addTeamToMember,
  addTeamToMembersBatch,
  removeTeamFromMember,
  removeTeamFromMembersBatch,
} from '@caesar/common/actions/entities/member';
import {
  removeChildItemsBatchFromItems,
  addChildItemsBatchToItems,
} from '@caesar/common/actions/entities/item';
import {
  CREATE_CHILD_ITEM_BATCH_FINISHED_EVENT,
  removeChildItemsBatch,
} from '@caesar/common/actions/entities/childItem';
import {
  setCurrentTeamId,
  leaveTeam,
  joinTeam,
} from '@caesar/common/actions/user';
import { teamSelector } from '@caesar/common/selectors/entities/team';
import { teamItemListSelector } from '@caesar/common/selectors/entities/item';
import {
  currentTeamIdSelector,
  userDataSelector,
  userTeamIdsSelector,
} from '@caesar/common/selectors/user';
import {
  getTeams,
  postCreateTeam,
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
  TEAM_ENTITY_TYPE,
  NOOP_NOTIFICATION,
} from '@caesar/common/constants';
import {
  prepareUsersForSharing,
  getItemUserPairs,
} from '@caesar/common/sagas/common/share';
import { inviteNewMemberBatchSaga } from '@caesar/common/sagas/common/invite';
import { createChildItemsFilterSelector } from '@caesar/common/selectors/entities/childItem';
import { updateGlobalNotification } from '@caesar/common/actions/application';

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
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
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
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
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
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(updateTeamMemberRoleFailure());
  }
}

export function* addTeamMembersBatchSaga({ payload: { teamId, members } }) {
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

    const itemUserPairs = yield call(getItemUserPairs, {
      items: teamItemList,
      members: teamMembers,
    });

    const invitedMemberIds = teamMembers.map(({ id }) => id);
    const invitedMembersWithCommandRole = teamMembers.map(member => ({
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

    if (itemUserPairs.length > 0) {
      yield fork(createChildItemBatchSaga, {
        payload: { itemUserPairs },
      });

      const {
        payload: { childItems },
      } = yield take(CREATE_CHILD_ITEM_BATCH_FINISHED_EVENT);

      const itemIdsWithChildItemIdsSet = childItems.reduce(
        // eslint-disable-next-line
        (accumulator, item) => [
          ...accumulator,
          {
            itemId: item.originalItemId,
            childItemIds: item.items.map(({ id }) => id),
          },
        ],
        [],
      );

      yield put(addChildItemsBatchToItems(itemIdsWithChildItemIdsSet));
    }

    yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));
  } catch (error) {
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
  yield takeLatest(REMOVE_TEAM_REQUEST, removeTeamSaga);
  yield takeLatest(UPDATE_TEAM_MEMBER_ROLE_REQUEST, updateTeamMemberRoleSaga);
  yield takeLatest(ADD_TEAM_MEMBERS_BATCH_REQUEST, addTeamMembersBatchSaga);
  yield takeLatest(REMOVE_TEAM_MEMBER_REQUEST, removeTeamMemberSaga);
}
