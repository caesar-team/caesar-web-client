import { Pool, spawn, Worker } from 'threads';
import { call, put, take } from 'redux-saga/effects';
import { encryptionFinishedEvent } from '@caesar/common/actions/application';
import { chunk } from '@caesar/common/utils/utils';
import { ENCRYPTION_CHUNK_SIZE } from '@caesar/common/constants';
import { createPoolChannel } from './channels';
import { normalizeEvent } from './utils';
import {
  TASK_QUEUE_COMPLETED_EVENT_TYPE,
  POOL_QUEUE_FINISHED_EVENT_TYPE,
  POOL_QUEUE_INITIALIZED_EVENT_TYPE,
} from './constants';

const taskAction = pairs => async task => {
  // eslint-disable-next-line
  return await task.encryptAll(pairs);
};

export function* encryption({ items, coresCount }) {
  const buffer = [];

  const chunks = chunk(items, ENCRYPTION_CHUNK_SIZE);

  const normalizerEvent = normalizeEvent(coresCount);
  const pool = Pool(() => spawn(new Worker('../../workers/encryption')), {
    name: 'encryption',
    size: coresCount,
  });
  const poolChannel = yield call(createPoolChannel, pool);

  while (poolChannel) {
    const event = yield take(poolChannel);

    if (event.type === POOL_QUEUE_INITIALIZED_EVENT_TYPE) {
      break;
    }
  }

  chunks.map(pairs => pool.queue(taskAction(pairs)));

  while (poolChannel) {
    try {
      const event = normalizerEvent(yield take(poolChannel));

      switch (event.type) {
        case TASK_QUEUE_COMPLETED_EVENT_TYPE:
          buffer.push(...event.returnValue);
          break;
        case POOL_QUEUE_FINISHED_EVENT_TYPE:
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
