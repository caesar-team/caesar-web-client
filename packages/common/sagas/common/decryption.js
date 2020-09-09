import { Pool, spawn, Worker } from 'threads';
import { call, put, take } from 'redux-saga/effects';
import { addItemsBatch } from '@caesar/common/actions/entities/item';
import { addSystemItemsBatch } from '@caesar/common/actions/entities/system';
import { updateWorkInProgressItemRaws } from '@caesar/common/actions/workflow';
import { arrayToObject, chunk, match } from '@caesar/common/utils/utils';
import { checkItemsAfterDecryption } from '@caesar/common/utils/item';
import { DECRYPTION_CHUNK_SIZE, ITEM_TYPE } from '@caesar/common/constants';
import { createPoolChannel } from './channels';
import { normalizeEvent } from './utils';
import {
  TASK_QUEUE_COMPLETED_EVENT_TYPE,
  POOL_QUEUE_FINISHED_EVENT_TYPE,
  POOL_QUEUE_INITIALIZED_EVENT_TYPE,
} from './constants';

const taskAction = (items, raws, key, masterPassword) => async task => {
  await task.init(key, masterPassword);
  let result = [];

  if (items) {
    result = await task.decryptAll(items);
  } else if (raws) {
    result = await task.decryptRaws(raws);
  }

  return result;
};

export function* decryption({ items, raws, key, masterPassword, coresCount }) {
  const itemsById = items ? arrayToObject(items) : {};

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

  if (items) {
    const chunks = chunk(items, DECRYPTION_CHUNK_SIZE);

    chunks.map(itemsChunk =>
      pool.queue(taskAction(itemsChunk, null, key, masterPassword)),
    );
  }

  if (raws) {
    pool.queue(taskAction(null, raws, key, masterPassword));
  }

  while (poolChannel) {
    try {
      const event = normalizerEvent(yield take(poolChannel));

      switch (event.type) {
        case TASK_QUEUE_COMPLETED_EVENT_TYPE:
          if (items) {
            const systemItems = [];
            const nonSystemItems = [];

            Object.values(itemsById).forEach(item => {
              if (item.type === ITEM_TYPE.SYSTEM) {
                systemItems.push(item);
              } else {
                nonSystemItems.push(item);
              }
            });
            if (systemItems.length > 0) {
              yield put(
                addSystemItemsBatch(
                  match(
                    arrayToObject(systemItems),
                    checkItemsAfterDecryption(event.returnValue),
                  ),
                ),
              );
            }
            if (nonSystemItems.length > 0) {
              yield put(
                addItemsBatch(
                  match(
                    arrayToObject(nonSystemItems),
                    checkItemsAfterDecryption(event.returnValue),
                  ),
                ),
              );
            }
          }

          if (raws) {
            yield put(updateWorkInProgressItemRaws(event.returnValue));
          }
          break;
        case POOL_QUEUE_FINISHED_EVENT_TYPE:
          poolChannel.close();
          break;
        default:
          break;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }
}
