import { Pool, spawn, Worker } from 'threads';
import { call, put, take, select } from 'redux-saga/effects';
import { addItemsBatch } from 'common/actions/entities/item';
import {
  increaseCoresCount,
  decreaseCoresCount,
} from 'common/actions/application';
import { arrayToObject, chunk, match } from 'common/utils/utils';
import { availableCoresCountSelector } from 'common/selectors/application';
import { createPoolChannel } from './channels';
import { normalizeEvent } from './utils';
import {
  TASK_QUEUE_COMPLETED_EVENT_TYPE,
  POOL_QUEUE_FINISHED_EVENT_TYPE,
} from './constants';

const CHUNK_SIZE = 10;

const taskAction = (items, key, masterPassword) => async task => {
  await task.init(key, masterPassword);

  // eslint-disable-next-line
  return await task.decryptAll(items);
};

export function* decryption({ items, key, masterPassword }) {
  const availableCoresCount = yield select(availableCoresCountSelector);

  const itemsById = arrayToObject(items);
  const chunks = chunk(items, CHUNK_SIZE);

  const coresCount =
    chunks.length < availableCoresCount ? chunks.length : availableCoresCount;

  yield put(decreaseCoresCount(coresCount));

  const normalizerEvent = normalizeEvent(coresCount);
  const pool = Pool(() => spawn(new Worker('../../workers/decryption')), {
    name: 'decryption',
    size: coresCount,
  });
  const poolChannel = yield call(createPoolChannel, pool);
  chunks.map(itemsChunk =>
    pool.queue(taskAction(itemsChunk, key, masterPassword)),
  );

  while (poolChannel) {
    try {
      const event = normalizerEvent(yield take(poolChannel));

      switch (event.type) {
        case TASK_QUEUE_COMPLETED_EVENT_TYPE:
          yield put(addItemsBatch(match(itemsById, event.returnValue)));
          break;
        case POOL_QUEUE_FINISHED_EVENT_TYPE:
          yield put(increaseCoresCount(coresCount));
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
