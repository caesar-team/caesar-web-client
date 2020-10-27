import { call, put, takeLatest } from 'redux-saga/effects';
import {
  FETCH_USERS_REQUEST,
  fetchUsersSuccess,
  fetchUsersFailure,
} from '@caesar/common/actions/entities/user';
import { getUsers } from '@caesar/common/api';
import { convertUsersToEntity } from '@caesar/common/normalizers/normalizers';

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

export default function* userSagas() {
  yield takeLatest(FETCH_USERS_REQUEST, fetchUsersSaga);
}
