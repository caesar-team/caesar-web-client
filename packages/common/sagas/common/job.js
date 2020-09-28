import { call, put, takeEvery, select, spawn } from 'redux-saga/effects';
import { availableCoresCountSelector } from '@caesar/common/selectors/application';
import {
  increaseCoresCount,
  decreaseCoresCount,
} from '@caesar/common/actions/application';
import {
  DECRYPTION,
  DECRYPTION_END,
  ENCRYPTION,
  ENCRYPTION_END,
} from '@caesar/common/actions/workflow';
import { decryption } from '@caesar/common/sagas/common/decryption';
import { encryption } from '@caesar/common/sagas/common/encryption';
import { createQueue } from '@caesar/common/utils/queue';
import { uuid4 } from '@caesar/common/utils/uuid4';
import {
  DECRYPTION_CHUNK_SIZE,
  ENCRYPTION_CHUNK_SIZE,
} from '@caesar/common/constants';

const JOB_EVENTS = [DECRYPTION, DECRYPTION_END, ENCRYPTION, ENCRYPTION_END];
const JOB_END_EVENTS = [DECRYPTION_END, ENCRYPTION_END];

function getRequiredCoresCountFor(action) {
  const { type, payload } = action;

  const chunkSize =
    type === DECRYPTION ? DECRYPTION_CHUNK_SIZE : ENCRYPTION_CHUNK_SIZE;

  return Math.ceil(payload.items?.length || 1 / chunkSize);
}

function canRunJobImmediately(availableCoresCount) {
  return availableCoresCount > 0;
}

function getCoresCountFor(action, availableCoresCount) {
  const requiredCoresCount = getRequiredCoresCountFor(action);

  return requiredCoresCount < availableCoresCount
    ? requiredCoresCount
    : availableCoresCount;
}

function isEndJob(type) {
  return type && JOB_END_EVENTS.includes(type);
}

function prepareJob(action, coresCount) {
  return {
    id: uuid4(),
    action,
    coresCount,
  };
}

// job object:
// - id
// - coresCount
// - action: { type, payload }
function* jobSaga({ id, coresCount, action }) {
  const job = action.type === DECRYPTION ? decryption : encryption;

  const endEventType =
    action.type === DECRYPTION ? DECRYPTION_END : ENCRYPTION_END;

  yield call(job, { coresCount, ...action.payload });
  yield put({ type: endEventType, payload: { id, coresCount } });
}

function* jobAction(action) {
  const queue = createQueue();
  if (isEndJob(action.type)) {
    yield put(increaseCoresCount(action.payload.coresCount));

    const availableCoresCount = yield select(availableCoresCountSelector);

    if (!queue.isEmpty()) {
      if (canRunJobImmediately(availableCoresCount)) {
        const nextJob = queue.dequeue();

        const coresCount = getCoresCountFor(
          nextJob.action,
          availableCoresCount,
        );
        const job = prepareJob(nextJob.action, coresCount);

        yield put(decreaseCoresCount(coresCount));
        yield spawn(jobSaga, job);
      }
    }
  } else {
    const availableCoresCount = yield select(availableCoresCountSelector);

    if (canRunJobImmediately(availableCoresCount)) {
      const coresCount = getCoresCountFor(action, availableCoresCount);
      const job = prepareJob(action, coresCount);

      yield put(decreaseCoresCount(coresCount));
      yield spawn(jobSaga, job);
    } else {
      // cores count will be estimated when job will be pulled out from queue
      const job = prepareJob(action, null);

      queue.enqueue(job);
    }
  }
}
export function* jobLoadBalancerSaga() {
  yield takeEvery(JOB_EVENTS, jobAction);
}
