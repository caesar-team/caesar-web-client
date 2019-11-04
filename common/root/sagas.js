import { all, fork } from 'redux-saga/effects';
import {
  userSagas,
  workflowSagas,
  applicationSagas,
  memberSagas,
  listSagas,
  itemSagas,
  childItemSagas,
  teamSagas,
} from 'common/sagas';
import { watchRequests } from 'common/sagas/common/job';

const sagas = [
  userSagas,
  workflowSagas,
  applicationSagas,
  memberSagas,
  listSagas,
  itemSagas,
  childItemSagas,
  teamSagas,
];

export function* rootSaga() {
  yield fork(watchRequests);
  yield all(sagas.map(fork));
}
