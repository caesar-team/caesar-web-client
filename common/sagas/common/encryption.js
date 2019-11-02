import { Pool, spawn, Worker } from 'threads';
import { call, put, take, select } from 'redux-saga/effects';
import { encryptionFinishedEvent } from 'common/actions/application';
import { availableCoresCountSelector } from 'common/selectors/application';
import { chunk } from 'common/utils/utils';
import { ENCRYPTION_CHUNK_SIZE } from 'common/constants';
import { createPoolChannel } from './channels';
import { normalizeEvent } from './utils';
import {
  TASK_QUEUE_COMPLETED_EVENT_TYPE,
  POOL_QUEUE_FINISHED_EVENT_TYPE,
} from './constants';

const taskAction = pairs => async task => {
  // eslint-disable-next-line
  return await task.encryptAll(pairs);
};

export function* encryption(itemUserPairs) {
  const buffer = [];

  const availableCoresCount = yield select(availableCoresCountSelector);

  const chunks = chunk(itemUserPairs, ENCRYPTION_CHUNK_SIZE);

  const coresCount = (availableCoresCount - 1) / 2;

  const normalizerEvent = normalizeEvent(coresCount);
  const pool = Pool(() => spawn(new Worker('../../workers/encryption')), {
    name: 'encryption',
    size: coresCount,
  });
  const poolChannel = yield call(createPoolChannel, pool);
  chunks.map(pairs => pool.queue(taskAction(pairs)));

  while (poolChannel) {
    try {
      const event = normalizerEvent(yield take(poolChannel));

      switch (event.type) {
        case TASK_QUEUE_COMPLETED_EVENT_TYPE:
          buffer.push(...event.returnValue);
          break;
        case POOL_QUEUE_FINISHED_EVENT_TYPE:
          // yield put(increaseCoresCount(coresCount));
          yield put(encryptionFinishedEvent(buffer));
          poolChannel.close();
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
