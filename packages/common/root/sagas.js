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
} from '@caesar/common/sagas';
import { jobLoadBalancerSaga } from '@caesar/common/sagas/common/job';
import { isClient } from '@caesar/common/utils/isEnvironment';

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
