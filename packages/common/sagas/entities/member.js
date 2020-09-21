import Router from 'next/router';
import { call, put, takeLatest, all } from 'redux-saga/effects';
import {
  CREATE_MEMBER_BATCH_REQUEST,
  CREATE_MEMBER_REQUEST,
  createMemberBatchFailure,
  createMemberBatchSuccess,
  createMemberFailure,
  createMemberSuccess,
  FETCH_MEMBERS_REQUEST,
  FETCH_TEAM_MEMBERS_REQUEST,
  fetchMembersFailure,
  fetchMembersSuccess,
  leaveTeamFailure,
  leaveTeamSuccess,
  removeTeamFromMember,
  LEAVE_TEAM_REQUEST,
} from "@caesar/common/actions/entities/member";
import {
  updateTeamMembersWithRoles,
  removeTeamMemberSuccess,
} from '@caesar/common/actions/entities/team';
import { userIdSelector } from '@caesar/common/selectors/user';
import {
  getMembers,
  getPublicKeyByEmailBatch,
  getTeamMembers,
  postLeaveTeam,
  postNewUser,
  postNewUserBatch,
  updateKey
} from "@caesar/common/api";
import { convertMembersToEntity } from '@caesar/common/normalizers/normalizers';
import {
  generateSeedAndVerifier,
  generateUser,
  generateUsersBatch,
} from '@caesar/common/utils/cipherUtils';
import { ENTITY_TYPE, ROLE_ANONYMOUS_USER, ROUTES } from '@caesar/common/constants';
import { updateGlobalNotification } from '@caesar/common/actions/application';
import { getServerErrorMessage } from '@caesar/common/utils/error';

const setNewFlag = (members, isNew) =>
  members.map(member => ({
    ...member,
    isNew,
  }));

const renameUserId = members =>
  members.map(({ userId, ...member }) => ({ id: userId, ...member }));

export function* fetchMembersSaga() {
  try {
    const { data: members } = yield call(getMembers);

    yield put(fetchMembersSuccess(convertMembersToEntity(members)));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(fetchMembersFailure());
  }
}

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
      roles: [role],
    };

    const {
      data: { user: userId },
    } = yield call(postNewUser, data);

    if (role !== ROLE_ANONYMOUS_USER) {
      yield put(
        createMemberSuccess({
          id: userId,
          email,
          name: email,
          avatar: null,
          publicKey,
          roles: [role],
        }),
      );
    }

    return { ...data, name: email, masterPassword, id: userId, password };
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
        roles: [emailRoleObject[email]],
        ...generateSeedAndVerifier(email, password),
      }),
    );

    const {
      data: { users: userIds },
    } = yield call(postNewUserBatch, { users: members });

    const preparedMembersForStore = userIds.reduce(
      (accumulator, userId, index) => {
        const member = members[index];

        return member.roles.includes(ROLE_ANONYMOUS_USER)
          ? accumulator
          : [
              ...accumulator,
              {
                id: userId,
                email: member.email,
                name: member.email,
                avatar: null,
                publicKey: member.publicKey,
                roles: [emailRoleObject[member.email]],
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
    console.log(e);

    return [];
  }
}

export function* fetchTeamMembersSaga({
  payload: { teamId, needUpdateTeamMembers = false },
}) {
  try {
    const { data } = yield call(getTeamMembers, teamId);

    yield put(fetchMembersSuccess(convertMembersToEntity(data)));

    if (needUpdateTeamMembers) {
      yield put(updateTeamMembersWithRoles(teamId, data));
    }
  } catch (e) {
    yield put(fetchMembersFailure());
  }
}


export function* leaveTeamSaga({ payload: { teamId } }) {
  try {
    yield call(postLeaveTeam, teamId);
    const userId = yield select(userIdSelector);

    yield put(leaveTeamSuccess());
    yield put(removeTeamMemberSuccess(teamId, userId));
    yield put(removeTeamFromMember(teamId, userId));
    yield call(Router.push, ROUTES.SETTINGS + ROUTES.TEAM);
  } catch (e) {
    yield put(
      updateGlobalNotification(getServerErrorMessage(e), false, true),
    );    
    yield put(leaveTeamFailure());
  }
}

export default function* memberSagas() {
  yield takeLatest(FETCH_MEMBERS_REQUEST, fetchMembersSaga);
  yield takeLatest(CREATE_MEMBER_REQUEST, createMemberSaga);
  yield takeLatest(CREATE_MEMBER_BATCH_REQUEST, createMemberBatchSaga);
  yield takeLatest(FETCH_TEAM_MEMBERS_REQUEST, fetchTeamMembersSaga);
  yield takeLatest(LEAVE_TEAM_REQUEST, leaveTeamSaga);
}
