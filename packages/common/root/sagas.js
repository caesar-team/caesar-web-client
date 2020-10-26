import { all, fork } from 'redux-saga/effects';
import {
  currentUserSagas,
  workflowSagas,
  applicationSagas,
  memberSagas,
  listSagas,
  itemSagas,
  teamSagas,
} from '@caesar/common/sagas';
import { jobLoadBalancerSaga } from '@caesar/common/sagas/common/job';
import { shareItemSagas } from '@caesar/common/sagas/common/share';
import { anonymousSagas } from '@caesar/common/sagas/common/anonymous';
import { isClient } from '@caesar/common/utils/isEnvironment';

const sagas = [
  currentUserSagas,
  workflowSagas,
  applicationSagas,
  memberSagas,
  listSagas,
  itemSagas,
  teamSagas,
  shareItemSagas,
  anonymousSagas,
];

export function* rootSaga() {
  if (isClient) {
    yield fork(jobLoadBalancerSaga);
  }

  yield all(sagas.map(fork));
}
