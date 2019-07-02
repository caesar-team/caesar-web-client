import { put, call, takeLatest } from 'redux-saga/effects';
import {
  FETCH_MEMBERS_REQUEST,
  CREATE_MEMBER_REQUEST,
  FETCH_MEMBER_REQUEST,
  fetchMembersSuccess,
  fetchMembersFailure,
  createMemberSuccess,
  createMemberFailure,
  fetchMemberSuccess,
  fetchMemberFailure,
} from 'common/actions/member';
import { getUsers, postNewUser, getPublicKeyByEmail } from 'common/api';
import { normalizeMembers } from 'common/normalizers/member';
import { generateUser } from 'common/utils/cipherUtils';
import { createSrp } from 'common/utils/srp';
import { ANONYMOUS_USER_ROLE, INVITE_TYPE, USER_ROLE } from '../constants';

export function* fetchMembersSaga() {
  try {
    const { data } = yield call(getUsers);

    yield put(fetchMembersSuccess(normalizeMembers(data)));
  } catch (e) {
    yield put(fetchMembersFailure());
  }
}

export function* createMemberSaga({ payload: { email, role } }) {
  try {
    const srp = createSrp();

    const { password, masterPassword, publicKey, privateKey } = yield call(
      generateUser,
      email,
    );

    const seed = srp.getRandomSeed();
    const verifier = srp.generateV(srp.generateX(seed, email, password));

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

    if (role !== ANONYMOUS_USER_ROLE) {
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

export function* getOrCreateMemberSaga({ payload: { email, role } }) {
  try {
    const {
      data: { userId, publicKey },
    } = yield call(getPublicKeyByEmail, email);

    return { email, name: email, userId, publicKey, isNew: false };
  } catch (e) {
    const { id: userId, password, masterPassword, publicKey } = yield call(
      createMemberSaga,
      {
        payload: {
          email,
          role,
        },
      },
    );

    return {
      userId,
      email,
      password,
      masterPassword,
      publicKey,
      name: email,
      isNew: true,
    };
  }
}

export function* memberSagas() {
  yield takeLatest(FETCH_MEMBERS_REQUEST, fetchMembersSaga);
  yield takeLatest(CREATE_MEMBER_REQUEST, createMemberSaga);
}
