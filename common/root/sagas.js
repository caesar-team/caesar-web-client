import { all, fork } from 'redux-saga/effects';
import {
  memberSagas,
  userSagas,
  workflowSagas,
  listSagas,
  itemSagas,
  childItemSagas,
  teamSagas,
} from 'common/sagas';

const sagas = [
  memberSagas,
  userSagas,
  workflowSagas,
  listSagas,
  itemSagas,
  childItemSagas,
  teamSagas,
];

export function* rootSaga() {
  yield all(sagas.map(fork));
}
