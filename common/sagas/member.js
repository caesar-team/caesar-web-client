import { put, call, takeLatest } from 'redux-saga/effects';
import {
  FETCH_MEMBERS_REQUEST,
  CREATE_MEMBER_REQUEST,
  CREATE_MEMBER_BATCH_REQUEST,
  fetchMembersSuccess,
  fetchMembersFailure,
  createMemberSuccess,
  createMemberFailure,
  createMemberBatchSuccess,
  createMemberBatchFailure,
} from 'common/actions/member';
import {
  getUsers,
  postNewUser,
  getPublicKeyByEmail,
  getPublicKeyByEmailBatch,
  postNewUserBatch,
} from 'common/api';
import { normalizeMembers } from 'common/normalizers/member';
import {
  generateUser,
  generateUsers,
  generateSeedAndVerifier,
} from 'common/utils/cipherUtils';
import { ANONYMOUS_USER_ROLE } from '../constants';

const setIsNewFlag = (members, isNew) =>
  members.map(member => ({
    ...member,
    isNew,
  }));

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

export function* createMemberBatchSaga({ payload: { emails, role } }) {
  try {
    if (!emails.length) {
      return [];
    }

    const generatedUsers = yield call(generateUsers, emails);

    const members = generatedUsers.map(
      ({ email, password, publicKey, privateKey }) => ({
        email,
        publicKey,
        encryptedPrivateKey: privateKey,
        plainPassword: password,
        roles: [role],
        ...generateSeedAndVerifier(email, password),
      }),
    );

    const {
      data: { users: userIds },
    } = yield call(postNewUserBatch, { users: members });

    const preparedMembersForStore = userIds.map((userId, index) => {
      const member = members[index];

      return {
        userId,
        email: member.email,
        name: member.email,
        avatar: null,
        publicKey: member.publicKey,
        roles: [role],
      };
    });

    const returnedMembers = preparedMembersForStore.map((member, index) => ({
      ...member,
      masterPassword: generatedUsers[index].masterPassword,
      password: member.plainPassword,
    }));

    if (role !== ANONYMOUS_USER_ROLE) {
      yield put(createMemberBatchSuccess(preparedMembersForStore));
    }

    return returnedMembers;
  } catch (error) {
    yield put(createMemberBatchFailure());
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

export function* getOrCreateMemberBatchSaga({ payload: { emails, role } }) {
  try {
    const { data: existedMembers } = yield call(getPublicKeyByEmailBatch, {
      emails,
    });

    const existedMemberEmails = existedMembers.map(({ email }) => email);

    const needCreateMembers = emails.filter(
      email => !existedMemberEmails.includes(email),
    );

    const newMembers = yield call(createMemberBatchSaga, {
      payload: {
        emails: needCreateMembers,
        role,
      },
    });

    return [
      ...setIsNewFlag(existedMembers, false),
      ...setIsNewFlag(newMembers, true),
    ];
  } catch (e) {
    console.log(e);
    return [];
  }
}

export function* memberSagas() {
  yield takeLatest(FETCH_MEMBERS_REQUEST, fetchMembersSaga);
  yield takeLatest(CREATE_MEMBER_REQUEST, createMemberSaga);
  yield takeLatest(CREATE_MEMBER_BATCH_REQUEST, createMemberBatchSaga);
}
