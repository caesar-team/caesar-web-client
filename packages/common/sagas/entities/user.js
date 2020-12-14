import { call, put, takeLatest, select } from 'redux-saga/effects';
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
import { userIdsSelector } from '@caesar/common/selectors/entities/user';
import { getUsers, postNewUser, postNewUserBatch } from '@caesar/common/api';
import { convertUsersToEntity } from '@caesar/common/normalizers/normalizers';
import {
  generateSeedAndVerifier,
  generateUser,
  generateUsersBatch,
} from '@caesar/common/utils/cipherUtils';
import { DOMAIN_ROLES } from '@caesar/common/constants';
import { inviteNewUserBatchSaga } from '../common/invite';

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

    const inviteUser = {
      email,
      plainPassword: password,
      masterPassword,
    };

    yield call(inviteNewUserBatchSaga, { payload: { users: [inviteUser] } });

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

    const inviteUsers = generatedUsers.map(
      ({ email, password, masterPassword }) => ({
        email,
        plainPassword: password,
        masterPassword,
      }),
    );

    yield call(inviteNewUserBatchSaga, { payload: { users: inviteUsers } });

    const convertedUsers = convertUsersToEntity(serverUsers) || {};

    yield put(createUserBatchSuccess(convertedUsers));

    return Object.values(convertedUsers);
  } catch (error) {
    yield put(createUserBatchFailure());

    return null;
  }
}

export function* getOrCreateUserBatchSaga(users) {
  try {
    // Update domain user list before create new domain user
    yield call(fetchUsersSaga);

    const domainUserIds = yield select(userIdsSelector);
    const domainUsers = users.filter(user => domainUserIds.includes(user.id));
    const notDomainUsers = users.filter(
      user => !domainUserIds.includes(user.id),
    );
    let createdUsers = [];

    if (notDomainUsers.length) {
      const newUsers = yield call(createUserBatchSaga, {
        payload: {
          emailRolePairs: notDomainUsers.map(user => ({
            email: user.email,
            domainRole: DOMAIN_ROLES.ROLE_USER,
          })),
        },
      });

      createdUsers = newUsers;
    }

    return { domainUsers, createdUsers };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error: ', error);

    return null;
  }
}

export default function* userSagas() {
  yield takeLatest(FETCH_USERS_REQUEST, fetchUsersSaga);
  yield takeLatest(CREATE_USER_REQUEST, createUserSaga);
  yield takeLatest(CREATE_USER_BATCH_REQUEST, createUserBatchSaga);
}
