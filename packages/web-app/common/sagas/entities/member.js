import { call, put, takeLatest } from 'redux-saga/effects';
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
} from 'common/actions/entities/member';
import {
  getMembers,
  getPublicKeyByEmailBatch,
  getTeamMembers,
  postNewUser,
  postNewUserBatch,
} from 'common/api';
import { convertMembersToEntity } from 'common/normalizers/normalizers';
import {
  generateSeedAndVerifier,
  generateUser,
  generateUsersBatch,
} from 'common/utils/cipherUtils';
import { MEMBER_ENTITY_TYPE, ROLE_ANONYMOUS_USER } from 'common/constants';

const setIsNewFlag = (members, isNew) =>
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
    console.log(error);
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
                __type: MEMBER_ENTITY_TYPE,
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
      ...setIsNewFlag(renameUserId(existedMembers), false),
      ...setIsNewFlag(renameUserId(newMembers), true),
    ];
  } catch (e) {
    console.log(e);
    return [];
  }
}

export function* fetchTeamMembersSaga({ payload: { teamId } }) {
  try {
    const { data } = yield call(getTeamMembers, teamId);

    yield put(fetchMembersSuccess(convertMembersToEntity(data)));
  } catch (e) {
    yield put(fetchMembersFailure());
  }
}

export default function* memberSagas() {
  yield takeLatest(FETCH_MEMBERS_REQUEST, fetchMembersSaga);
  yield takeLatest(CREATE_MEMBER_REQUEST, createMemberSaga);
  yield takeLatest(CREATE_MEMBER_BATCH_REQUEST, createMemberBatchSaga);
  yield takeLatest(FETCH_TEAM_MEMBERS_REQUEST, fetchTeamMembersSaga);
}
