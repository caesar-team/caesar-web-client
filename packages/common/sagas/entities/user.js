import { call, put, takeLatest } from 'redux-saga/effects';
import {
  FETCH_USERS_REQUEST,
  fetchUsersSuccess,
  fetchUsersFailure,
  CREATE_USER_REQUEST,
  createUserSuccess,
  createUserFailure,
} from '@caesar/common/actions/entities/user';
import { getUsers, postNewUser } from '@caesar/common/api';
import { convertUsersToEntity } from '@caesar/common/normalizers/normalizers';
import {
  generateSeedAndVerifier,
  generateUser,
  generateUsersBatch,
} from '@caesar/common/utils/cipherUtils';
import { ENTITY_TYPE, DOMAIN_ROLES } from '@caesar/common/constants';

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
    const { password, publicKey, privateKey } = yield call(generateUser, email);

    const { seed, verifier } = generateSeedAndVerifier(email, password);

    const data = {
      email,
      plainPassword: password,
      publicKey,
      encryptedPrivateKey: privateKey,
      seed,
      verifier,
      // TODO: replace with domainRoles when @aburov merges his pr
      roles: [domainRole],
      // domainRoles: [domainRole],
    };

    const { data: user } = yield call(postNewUser, data);
    const convertedUser = convertUsersToEntity([{ ...data, ...user }]);

    if (domainRole !== DOMAIN_ROLES.ROLE_ANONYMOUS_USER) {
      yield put(createUserSuccess(convertedUser));
    }

    return convertedUser[user.id];
  } catch (error) {
    yield put(createUserFailure());

    return null;
  }
}

export default function* userSagas() {
  yield takeLatest(FETCH_USERS_REQUEST, fetchUsersSaga);
  yield takeLatest(CREATE_USER_REQUEST, createUserSaga);
}
