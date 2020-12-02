import { call, put, takeLatest, all, select } from 'redux-saga/effects';
import {
  FETCH_TEAM_MEMBERS_REQUEST,
  fetchTeamMembersFailure,
  fetchTeamMembersSuccess,
  ADD_TEAM_MEMBERS_BATCH_REQUEST,
  addTeamMembersBatchSuccess,
  addTeamMembersBatchFailure,
  UPDATE_TEAM_MEMBER_ROLE_REQUEST,
  updateTeamMemberRoleSuccess,
  updateTeamMemberRoleFailure,
  REMOVE_TEAM_MEMBER_REQUEST,
  removeTeamMemberSuccess,
  removeTeamMemberFailure,
  GRANT_ACCESS_TEAM_MEMBER_REQUEST,
} from '@caesar/common/actions/entities/member';
import {
  addMembersToTeamList,
  removeMemberFromTeam,
} from '@caesar/common/actions/entities/team';
import {
  getTeamMembers,
  postAddTeamMemberBatch,
  updateTeamMember,
  deleteTeamMember,
} from '@caesar/common/api';
import { convertMembersToEntity } from '@caesar/common/normalizers/normalizers';
import {
  NOOP_NOTIFICATION,
  COMMON_PROGRESS_NOTIFICATION,
} from '@caesar/common/constants';
import { updateGlobalNotification } from '@caesar/common/actions/application';
import { getServerErrorMessage } from '@caesar/common/utils/error';
import { teamKeyPairSelector } from '@caesar/common/selectors/keystore';
import {
  usersBatchSelector,
  userSelector,
} from '../../selectors/entities/user';
import { memberSelector } from '../../selectors/entities/member';
import { encryptMemberTeamKey } from './team';
import { saveKeyPair } from './item';

export function* addUserToTeamListBatchSaga({ payload: { teamId, users } }) {
  try {
    const keypair = yield select(teamKeyPairSelector, { teamId });
    const userIds = users.map(user => user.id);
    const rolesById = users.reduce((acc, user) => {
      acc[user.id] = user.role;

      return acc;
    }, {});
    // Domain users
    // TODO: Invite unregistered users
    const newUsers = yield select(usersBatchSelector, { userIds });

    const postDataSagas = newUsers.map(user =>
      call(encryptMemberTeamKey, {
        user: {
          ...user,
          role: rolesById[user.id],
        },
        keypair,
      }),
    );
    const postData = yield all(postDataSagas);

    const { data: serverMembers } = yield call(postAddTeamMemberBatch, {
      members: postData,
      teamId,
    });

    const membersById = convertMembersToEntity(serverMembers);

    yield put(addTeamMembersBatchSuccess(membersById));
    yield put(addMembersToTeamList(teamId, membersById));

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

export function* fetchTeamMembersSaga({ payload: { teamId, withoutKeys } }) {
  try {
    const { data: teamMembers } = yield call(getTeamMembers, { teamId });

    let membersWithoutKeysById = {};

    if (withoutKeys) {
      const { data: membersWithoutKeys } = yield call(getTeamMembers, {
        teamId,
        withoutKeys,
      });
      membersWithoutKeysById = convertMembersToEntity(membersWithoutKeys);
    }

    const membersById = convertMembersToEntity(
      teamMembers.map(member => {
        if (membersWithoutKeysById[member.id]) {
          return {
            ...member,
            accessGranted: false,
          };
        }

        return {
          ...member,
          accessGranted: true,
        };
      }),
    );

    yield put(fetchTeamMembersSuccess(membersById));
  } catch (e) {
    yield put(fetchTeamMembersFailure());
  }
}

export function* updateTeamMemberRoleSaga({ payload: { memberId, teamRole } }) {
  try {
    const member = yield select(memberSelector, { memberId });
    yield call(updateTeamMember, {
      teamId: member.teamId,
      userId: member.userId,
      teamRole,
    });

    yield put(updateTeamMemberRoleSuccess(memberId, teamRole));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(updateTeamMemberRoleFailure());
  }
}

export function* removeTeamMemberSaga({
  payload: { memberId },
  meta: { handleCloseRemoveMemberModal },
}) {
  try {
    const member = yield select(memberSelector, { memberId });

    yield call(deleteTeamMember, {
      teamId: member.teamId,
      userId: member.userId,
    });
    yield put(removeTeamMemberSuccess(memberId));
    yield put(removeMemberFromTeam(member.teamId, memberId));

    yield put(updateGlobalNotification(NOOP_NOTIFICATION, false));
    yield call(handleCloseRemoveMemberModal);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
    yield put(removeTeamMemberFailure());
    yield call(handleCloseRemoveMemberModal);
  }
}

export function* grantAccessTeamMemberSaga({ payload: { memberId } }) {
  try {
    yield put(updateGlobalNotification(COMMON_PROGRESS_NOTIFICATION, false));

    const { teamId, userId } = yield select(memberSelector, { memberId });
    const user = yield select(userSelector, { userId });
    const keypair = yield select(teamKeyPairSelector, {
      teamId,
    });

    const { secret } = yield call(encryptMemberTeamKey, {
      user,
      keypair,
    });

    yield call(saveKeyPair, {
      ownerId: userId,
      teamId,
      secret,
    });

    yield call(fetchTeamMembersSaga, {
      payload: { teamId, withoutKeys: true },
    });

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

export default function* memberSagas() {
  yield takeLatest(FETCH_TEAM_MEMBERS_REQUEST, fetchTeamMembersSaga);
  yield takeLatest(ADD_TEAM_MEMBERS_BATCH_REQUEST, addUserToTeamListBatchSaga);
  yield takeLatest(UPDATE_TEAM_MEMBER_ROLE_REQUEST, updateTeamMemberRoleSaga);
  yield takeLatest(REMOVE_TEAM_MEMBER_REQUEST, removeTeamMemberSaga);
  yield takeLatest(GRANT_ACCESS_TEAM_MEMBER_REQUEST, grantAccessTeamMemberSaga);
}
