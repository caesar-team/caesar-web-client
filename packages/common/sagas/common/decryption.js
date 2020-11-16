import { Pool, spawn, Worker } from 'threads';
import { call, put, take } from 'redux-saga/effects';
import { addItemsBatch } from '@caesar/common/actions/entities/item';
import { addSystemItemsBatch } from '@caesar/common/actions/entities/system';
import { addKeyPairsBatch } from '@caesar/common/actions/entities/keypair';
import {
  decryptionEnd,
  updateWorkInProgressItemRaws,
} from '@caesar/common/actions/workflow';
import { arrayToObject, chunk, match } from '@caesar/common/utils/utils';
import {
  checkItemsAfterDecryption,
  isGeneralItem,
  isKeyPairItem,
  isSystemItem,
} from '@caesar/common/utils/item';
import { DECRYPTION_CHUNK_SIZE } from '@caesar/common/constants';
import { createPoolChannel } from './channels';
import { normalizeEvent } from './utils';
import {
  TASK_QUEUE_COMPLETED_EVENT_TYPE,
  POOL_QUEUE_FINISHED_EVENT_TYPE,
  POOL_QUEUE_INITIALIZED_EVENT_TYPE,
} from './constants';

const matchInboundAndOutbound = ({ inbound, outbound }) => {
  return match(
    Array.isArray(inbound) ? arrayToObject(inbound) : inbound,
    checkItemsAfterDecryption(outbound),
  );
};

const matchAndAddItems = ({ inbound, outbound }) => {
  return addItemsBatch(matchInboundAndOutbound({ inbound, outbound }));
};

const matchAndAddSystemItems = ({ inbound, outbound }) => {
  return addSystemItemsBatch(matchInboundAndOutbound({ inbound, outbound }));
};

const matchAndAddKeyPairs = ({ inbound, outbound }) => {
  return addKeyPairsBatch(matchInboundAndOutbound({ inbound, outbound }));
};

const taskAction = (items, raws, key, masterPassword) => async task => {
  let result = [];

  try {
    await task.init(key, masterPassword);
    if (items) {
      result = await task.decryptAll(items);
    } else if (raws) {
      result = await task.decryptRaws(raws);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      `Cannot unlock the key with the provided master password, these items or raws will be omitted`,
      items?.map(item => item.id) || [],
    );
  }

  return result;
};

export function* decryption({
  items,
  raws,
  key,
  masterPassword,
  coresCount,
  id,
}) {
  // Nothing to do here
  if (!raws && (!items || items.length <= 0)) {
    yield put(decryptionEnd(id, coresCount));

    return;
  }

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

  let chunkSize = 1;

  if (items) {
    const chunks = chunk(items, DECRYPTION_CHUNK_SIZE);
    chunkSize = chunks.length;
    chunks.map(itemsChunk =>
      pool.queue(taskAction(itemsChunk, null, key, masterPassword)),
    );
  }

  // TODO: Raws should be an array instead of a string. If the app get a hundreds of attachments in one item then the app will be freezed.
  if (raws) {
    const rawsChunks = chunk([raws], DECRYPTION_CHUNK_SIZE);
    chunkSize = rawsChunks.length;
    rawsChunks.map(rawsChunk =>
      pool.queue(taskAction(null, rawsChunk, key, masterPassword)),
    );
  }

  const normalizerEvent = normalizeEvent(chunkSize);

  while (poolChannel) {
    try {
      const event = normalizerEvent(yield take(poolChannel));

      switch (event.type) {
        case TASK_QUEUE_COMPLETED_EVENT_TYPE:
          if (items) {
            const systemItems = items.filter(isSystemItem);
            const keyPairsItems = items.filter(isKeyPairItem);
            const generalItems = items.filter(isGeneralItem);

            if (systemItems.length > 0) {
              yield put(
                matchAndAddSystemItems({
                  inbound: systemItems,
                  outbound: event.returnValue,
                }),
              );
            }

            if (keyPairsItems.length > 0) {
              yield put(
                matchAndAddKeyPairs({
                  inbound: keyPairsItems,
                  outbound: event.returnValue,
                }),
              );
            }

            if (generalItems.length > 0) {
              yield put(
                matchAndAddItems({
                  inbound: generalItems,
                  outbound: event.returnValue,
                }),
              );
            }
          }

          if (raws) {
            yield put(updateWorkInProgressItemRaws(event.returnValue));
          }

          break;
        case POOL_QUEUE_FINISHED_EVENT_TYPE:
          yield put(decryptionEnd(id, coresCount));
          poolChannel.close();
          break;
        default:
          break;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }
}
