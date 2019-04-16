import { all, fork } from 'redux-saga/effects';
import { nodeSagas } from 'common/sagas/node';
import { memberSagas } from 'common/sagas/member';
import { userSagas } from 'common/sagas/user';

export function* rootSaga() {
  yield all([nodeSagas, memberSagas, userSagas].map(saga => fork(saga)));
}
