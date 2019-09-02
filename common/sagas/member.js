import { put, call, takeLatest } from 'redux-saga/effects';
import {
  FETCH_MEMBERS_REQUEST,
  CREATE_MEMBER_REQUEST,
  CREATE_MEMBER_BATCH_REQUEST,
  FETCH_TEAM_MEMBERS_REQUEST,
  fetchMembersSuccess,
  fetchMembersFailure,
  createMemberSuccess,
  createMemberFailure,
  createMemberBatchSuccess,
  createMemberBatchFailure,
} from 'common/actions/member';
import {
  getUsers,
  getUsersByIds,
  getTeamMembers,
  postNewUser,
  getPublicKeyByEmailBatch,
  postNewUserBatch,
} from 'common/api';
import { convertMembersToEntity } from 'common/normalizers/normalizers';
import {
  generateUser,
  generateUsersBatch,
  generateSeedAndVerifier,
} from 'common/utils/cipherUtils';
import { ROLE_ANONYMOUS_USER } from 'common/constants';

const setIsNewFlag = (members, isNew) =>
  members.map(member => ({
    ...member,
    isNew,
  }));

export function* fetchMembersSaga({ payload: { memberIds } }) {
  try {
    const action = memberIds && memberIds.length > 0 ? getUsersByIds : getUsers;

    const { data } = yield call(action, memberIds);

    yield put(fetchMembersSuccess(convertMembersToEntity(data)));
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

export function* createMemberBatchSaga({ payload: { emails, role } }) {
  try {
    if (!emails.length) {
      return [];
    }

    const generatedUsers = yield call(generateUsersBatch, emails);

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
        id: userId,
        email: member.email,
        name: member.email,
        avatar: null,
        publicKey: member.publicKey,
        roles: [role],
      };
    });

    const returnedMembers = userIds.map((userId, index) => {
      const member = members[index];

      return {
        ...member,
        userId,
        masterPassword: generatedUsers[index].masterPassword,
        password: generatedUsers[index].password,
      };
    });

    if (role !== ROLE_ANONYMOUS_USER) {
      yield put(createMemberBatchSuccess(preparedMembersForStore));
    }

    return returnedMembers;
  } catch (error) {
    yield put(createMemberBatchFailure());
    return null;
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
