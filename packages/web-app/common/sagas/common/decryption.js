import { Pool, spawn, Worker } from 'threads';
import { call, put, take } from 'redux-saga/effects';
import { addItemsBatch } from 'common/actions/entities/item';
import { arrayToObject, chunk, match } from 'common/utils/utils';
import { checkItemsAfterDecryption } from 'common/utils/item';
import { DECRYPTION_CHUNK_SIZE } from 'common/constants';
import { createPoolChannel } from './channels';
import { normalizeEvent } from './utils';
import {
  TASK_QUEUE_COMPLETED_EVENT_TYPE,
  POOL_QUEUE_FINISHED_EVENT_TYPE,
  POOL_QUEUE_INITIALIZED_EVENT_TYPE,
} from './constants';

const taskAction = (items, key, masterPassword) => async task => {
  await task.init(key, masterPassword);

  // eslint-disable-next-line
  return await task.decryptAll(items);
};

export function* decryption({ items, key, masterPassword, coresCount }) {
  const itemsById = arrayToObject(items);
  const chunks = chunk(items, DECRYPTION_CHUNK_SIZE);

  const normalizerEvent = normalizeEvent(coresCount);
  const pool = Pool(() => spawn(new Worker('../../workers/decryption')), {
    name: 'decryption',
    size: coresCount,
  });
  const poolChannel = yield call(createPoolChannel, pool);

  while (poolChannel) {
    const event = yield take(poolChannel);

    if (event.type === POOL_QUEUE_INITIALIZED_EVENT_TYPE) {
      break;
    }
  }

  chunks.map(itemsChunk =>
    pool.queue(taskAction(itemsChunk, key, masterPassword)),
  );

  while (poolChannel) {
    try {
      const event = normalizerEvent(yield take(poolChannel));

      switch (event.type) {
        case TASK_QUEUE_COMPLETED_EVENT_TYPE:
          yield put(
            addItemsBatch(
              match(itemsById, checkItemsAfterDecryption(event.returnValue)),
            ),
          );
          break;
        case POOL_QUEUE_FINISHED_EVENT_TYPE:
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
