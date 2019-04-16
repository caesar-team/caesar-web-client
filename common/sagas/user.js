import { put, call, takeLatest } from 'redux-saga/effects';
import {
  FETCH_USER_SELF_REQUEST,
  FETCH_KEY_PAIR_REQUEST,
  fetchUserSelfSuccess,
  fetchUserSelfFailure,
  fetchKeyPairSuccess,
  fetchKeyPairFailure,
} from 'common/actions/user';
import { getUserSelf, getKeys } from 'common/api';

export function* fetchUserSelfSaga() {
  try {
    const { data } = yield call(getUserSelf);

    yield put(fetchUserSelfSuccess(data));
  } catch (e) {
    yield put(fetchUserSelfFailure());
  }
}

export function* fetchKeyPairSaga() {
  try {
    const { data } = yield call(getKeys);

    yield put(
      fetchKeyPairSuccess({
        privateKey: data.encryptedPrivateKey,
        publicKey: data.publicKey,
      }),
    );
  } catch (e) {
    yield put(fetchKeyPairFailure());
  }
}

export function* userSagas() {
  yield takeLatest(FETCH_USER_SELF_REQUEST, fetchUserSelfSaga);
  yield takeLatest(FETCH_KEY_PAIR_REQUEST, fetchKeyPairSaga);
}
