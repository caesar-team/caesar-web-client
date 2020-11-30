import { call, put, takeLatest, all, select } from 'redux-saga/effects';
import {
  CREATE_MEMBER_BATCH_REQUEST,
  CREATE_MEMBER_REQUEST,
  createMemberBatchFailure,
  createMemberBatchSuccess,
  createMemberFailure,
  createMemberSuccess,
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
  getPublicKeyByEmailBatch,
  getTeamMembers,
  postNewUser,
  postNewUserBatch,
  updateKey,
  postAddTeamMemberBatch,
  updateTeamMember,
  deleteTeamMember,
} from '@caesar/common/api';
import { convertMembersToEntity } from '@caesar/common/normalizers/normalizers';
import {
  generateSeedAndVerifier,
  generateUser,
  generateUsersBatch,
} from '@caesar/common/utils/cipherUtils';
import {
  ENTITY_TYPE,
  DOMAIN_ROLES,
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

const setNewFlag = (members, isNew) =>
  members.map(member => ({
    ...member,
    isNew,
  }));

const renameUserId = members =>
  members.map(({ userId, ...member }) => ({ id: userId, ...member }));

export function* createMemberSaga({ payload: { email, role } }) {
  try {
    const { password, masterPassword, publicKey, privateKey } = yield call(
      generateUser,
      email,
    );

    const { seed, verifier } = generateSeedAndVerifier(email, password);

    const data = {
      email,
      plainPassword: password,
      publicKey,
      encryptedPrivateKey: privateKey,
      seed,
      verifier,
      domainRoles: [role],
    };

    const { data: user } = yield call(postNewUser, data);

    if (role !== DOMAIN_ROLES.ROLE_ANONYMOUS_USER) {
      yield put(
        createMemberSuccess({
          id: user.id,
          email,
          name: email,
          avatar: null,
          publicKey,
          domainRoles: [role],
        }),
      );
    }

    return { ...data, name: email, masterPassword, id: user.id, password };
  } catch (error) {
    yield put(createMemberFailure());

    return null;
  }
}

export function* createMemberBatchSaga({ payload: { emailRolePairs } }) {
  try {
    if (!emailRolePairs.length) {
      return [];
    }

    const emails = emailRolePairs.map(({ email }) => email);
    const emailRoleObject = emailRolePairs.reduce(
      (accumulator, { email, role }) => ({
        ...accumulator,
        [email]: role,
      }),
      {},
    );

    const generatedUsers = yield call(generateUsersBatch, emails);

    const members = generatedUsers.map(
      ({ email, password, publicKey, privateKey }) => ({
        email,
        publicKey,
        encryptedPrivateKey: privateKey,
        plainPassword: password,
        domainRoles: [emailRoleObject[email]],
        ...generateSeedAndVerifier(email, password),
      }),
    );

    const { data: users } = yield call(postNewUserBatch, { users: members });

    const userIds = users.map(({ id }) => id);

    const preparedMembersForStore = userIds.reduce(
      (accumulator, userId, index) => {
        const member = members[index];

        return member.domainRoles.includes(DOMAIN_ROLES.ROLE_ANONYMOUS_USER)
          ? accumulator
          : [
              ...accumulator,
              {
                id: userId,
                email: member.email,
                name: member.email,
                avatar: null,
                publicKey: member.publicKey,
                domainRoles: [emailRoleObject[member.email]],
                teamIds: [],
                __type: ENTITY_TYPE.MEMBER,
              },
            ];
      },
      [],
    );

    yield put(createMemberBatchSuccess(preparedMembersForStore));

    return userIds.map((userId, index) => {
      const member = members[index];

      return {
        ...member,
        userId,
        masterPassword: generatedUsers[index].masterPassword,
        password: generatedUsers[index].password,
      };
    });
  } catch (error) {
    yield put(createMemberBatchFailure());

    return null;
  }
}

export function* getOrCreateMemberBatchSaga({ payload: { emailRolePairs } }) {
  try {
    const emailRoleObject = emailRolePairs.reduce(
      (accumulator, { email, role }) => ({
        ...accumulator,
        [email]: role,
      }),
      {},
    );
    const emails = emailRolePairs.map(({ email }) => email);

    const { data: existedMembers } = yield call(getPublicKeyByEmailBatch, {
      emails,
    });

    const existedMemberEmails = existedMembers.map(({ email }) => email);
    const notExistedMemberEmails = emails.filter(
      email => !existedMemberEmails.includes(email),
    );
    const existedMembersWithoutKeysEmails = existedMembers
      .filter(member => !member.publicKey)
      .map(({ email }) => email);

    if (existedMembersWithoutKeysEmails.length) {
      const generatedUsers = yield call(
        generateUsersBatch,
        existedMembersWithoutKeysEmails,
      );

      yield all(
        generatedUsers.map(({ email, publicKey, privateKey }) =>
          call(updateKey, email, {
            publicKey,
            encryptedPrivateKey: privateKey,
          }),
        ),
      );
    }

    const newMemberEmailRolePairs = notExistedMemberEmails.map(email => ({
      email,
      role: emailRoleObject[email],
    }));

    const newMembers = yield call(createMemberBatchSaga, {
      payload: {
        emailRolePairs: newMemberEmailRolePairs,
      },
    });

    // TODO: change userId to id on BE side
    return [
      ...setNewFlag(renameUserId(existedMembers), false),
      ...setNewFlag(renameUserId(newMembers), true),
    ];
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);

    return [];
  }
}

export function* addMemberToTeamListsBatchSaga({ payload: { teamId, users } }) {
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
  yield takeLatest(CREATE_MEMBER_REQUEST, createMemberSaga);
  yield takeLatest(CREATE_MEMBER_BATCH_REQUEST, createMemberBatchSaga);
  yield takeLatest(FETCH_TEAM_MEMBERS_REQUEST, fetchTeamMembersSaga);
  yield takeLatest(
    ADD_TEAM_MEMBERS_BATCH_REQUEST,
    addMemberToTeamListsBatchSaga,
  );
  yield takeLatest(UPDATE_TEAM_MEMBER_ROLE_REQUEST, updateTeamMemberRoleSaga);
  yield takeLatest(REMOVE_TEAM_MEMBER_REQUEST, removeTeamMemberSaga);
  yield takeLatest(GRANT_ACCESS_TEAM_MEMBER_REQUEST, grantAccessTeamMemberSaga);
}
