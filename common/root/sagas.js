import { all, fork } from 'redux-saga/effects';
import { nodeSagas } from 'common/sagas/node';

export function* rootSaga() {
  yield all([nodeSagas].map(saga => fork(saga)));
}
