import { call, put, take, select, spawn } from 'redux-saga/effects';
import { availableCoresCountSelector } from 'common/selectors/application';
import {
  increaseCoresCount,
  decreaseCoresCount,
} from 'common/actions/application';
import {
  DECRYPTION,
  DECRYPTION_END,
  ENCRYPTION,
  ENCRYPTION_END,
} from 'common/actions/workflow';
import { decryption } from 'common/sagas/common/decryption';
import { encryption } from 'common/sagas/common/encryption';
import { createQueue } from 'common/utils/queue';
import { uuid4 } from 'common/utils/uuid4';
import { DECRYPTION_CHUNK_SIZE, ENCRYPTION_CHUNK_SIZE } from 'common/constants';

const JOB_EVENTS = [DECRYPTION, DECRYPTION_END, ENCRYPTION, ENCRYPTION_END];
const JOB_END_EVENTS = [DECRYPTION_END, ENCRYPTION_END];

function getRequiredCoresCountFor(action) {
  const { type, payload } = action;

  const chunkSize =
    type === DECRYPTION ? DECRYPTION_CHUNK_SIZE : ENCRYPTION_CHUNK_SIZE;

  return Math.ceil(payload.items.length / chunkSize);
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

export function* jobLoadBalancerSaga() {
  const queue = createQueue();

  while (true) {
    const action = yield take(JOB_EVENTS);

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
}
