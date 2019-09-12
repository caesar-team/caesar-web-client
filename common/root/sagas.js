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
  yield all(sagas.map(fork));
}
