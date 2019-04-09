import { take, put, call, takeLatest } from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga';
import threadify from 'common/utils/thread';
import {
  FETCH_NODES_REQUEST,
  fetchNodesSuccess,
  fetchNodesFailure,
  addNode,
} from 'common/actions/nodes';
import { normalizeNodes } from 'common/normalizers/nodes';
import { getList } from 'common/api';

function createWebWorkerChannel(data) {
  const decryptJob = threadify(function decryption(nodes) {
    const thread = this;

    nodes.map(node => {
      console.log('iterate in worker', node);
      thread.emit(node);
    });

    return thread.return();
  });

  return eventChannel(emitter => {
    const job = decryptJob(data);

    job.emit = node => emitter(node);
    job.terminated = () => emitter(END);

    return () => job.terminate();
  });
}

export function* decryptSaga(data) {
  const channel = yield call(createWebWorkerChannel, data);

  while (channel) {
    try {
      const payload = yield take(channel);

      yield put(addNode(payload));
    } catch (e) {
      console.log(e);
    }
  }
}

export function* fetchNodesSaga() {
  try {
    const { data } = yield call(getList);

    const nodes = normalizeNodes(data);

    yield put(fetchNodesSuccess());

    yield call(decryptSaga, Object.values(nodes.entities.nodesById));
  } catch (e) {
    console.log(e);

    yield put(fetchNodesFailure());
  }
}

export function* nodeSagas() {
  yield takeLatest(FETCH_NODES_REQUEST, fetchNodesSaga);
}
