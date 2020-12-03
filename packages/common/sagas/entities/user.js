import { call, put, takeLatest, all } from 'redux-saga/effects';
import {
  FETCH_USERS_REQUEST,
  fetchUsersSuccess,
  fetchUsersFailure,
  CREATE_USER_REQUEST,
  createUserFailure,
  createUserSuccess,
  CREATE_USER_BATCH_REQUEST,
  createUserBatchFailure,
  createUserBatchSuccess,
} from '@caesar/common/actions/entities/user';
import {
  getUsers,
  getPublicKeyByEmailBatch,
  postNewUser,
  postNewUserBatch,
  updateKey,
} from '@caesar/common/api';
import { convertUsersToEntity } from '@caesar/common/normalizers/normalizers';
import {
  generateSeedAndVerifier,
  generateUser,
  generateUsersBatch,
} from '@caesar/common/utils/cipherUtils';
import { ENTITY_TYPE, DOMAIN_ROLES } from '@caesar/common/constants';

const setNewFlag = (users, isNew) =>
  users.map(user => ({
    ...user,
    isNew,
  }));

const renameUserId = users =>
  users.map(({ userId, ...user }) => ({ id: userId, ...user }));

export function* fetchUsersSaga() {
  try {
    const { data: users } = yield call(getUsers);

    yield put(fetchUsersSuccess(convertUsersToEntity(users)));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(fetchUsersFailure());
  }
}

export function* createUserSaga({ payload: { email, domainRole } }) {
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
      domainRoles: [domainRole],
    };

    const { data: user } = yield call(postNewUser, data);

    if (domainRole === DOMAIN_ROLES.ROLE_ANONYMOUS_USER) {
      return { ...data, ...user, masterPassword };
    }

    const convertedUser = convertUsersToEntity([user])[user.id] || {};
    yield put(createUserSuccess(convertedUser));

    return convertedUser;
  } catch (error) {
    yield put(createUserFailure());

    return null;
  }
}

export function* createUserBatchSaga({ payload: { emailRolePairs } }) {
  try {
    if (!emailRolePairs.length) {
      return [];
    }

    const emails = emailRolePairs.map(({ email }) => email);
    const emailRoleObject = emailRolePairs.reduce(
      (accumulator, { email, domainRole }) => ({
        ...accumulator,
        [email]: domainRole,
      }),
      {},
    );

    const generatedUsers = yield call(generateUsersBatch, emails);

    const users = generatedUsers.map(
      ({ email, password, publicKey, privateKey }) => ({
        email,
        plainPassword: password,
        publicKey,
        encryptedPrivateKey: privateKey,
        domainRoles: [emailRoleObject[email]],
        ...generateSeedAndVerifier(email, password),
      }),
    );

    const { data: serverUsers } = yield call(postNewUserBatch, { users });

    const convertedUsers = convertUsersToEntity(serverUsers) || {};

    yield put(createUserBatchSuccess(convertedUsers));

    return Object.values(convertedUsers);
  } catch (error) {
    yield put(createUserBatchFailure());

    return null;
  }
}

export function* getOrCreateUserBatchSaga({ payload: { emailRolePairs } }) {
  try {
    const emailRoleObject = emailRolePairs.reduce(
      (accumulator, { email, domainRole }) => ({
        ...accumulator,
        [email]: domainRole,
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
      domainRole: emailRoleObject[email],
    }));

    const newMembers = yield call(createUserBatchSaga, {
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

export default function* userSagas() {
  yield takeLatest(FETCH_USERS_REQUEST, fetchUsersSaga);
  yield takeLatest(CREATE_USER_REQUEST, createUserSaga);
  yield takeLatest(CREATE_USER_BATCH_REQUEST, createUserBatchSaga);
}
