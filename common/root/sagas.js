import { all, fork } from 'redux-saga/effects';
import {
  memberSagas,
  userSagas,
  workflowSagas,
  listSagas,
  itemSagas,
  childItemSagas,
} from 'common/sagas';

const sagas = [
  memberSagas,
  userSagas,
  workflowSagas,
  listSagas,
  itemSagas,
  childItemSagas,
];

export function* rootSaga() {
  yield all(sagas.map(fork));
}
