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
import { jobLoadBalancerSaga } from 'common/sagas/common/job';
import { isClient } from 'common/utils/isEnvironment';

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
  if (isClient) {
    yield fork(jobLoadBalancerSaga);
  }

  yield all(sagas.map(fork));
}
