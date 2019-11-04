import { channel } from 'redux-saga';
import { call, put, take, fork, select } from 'redux-saga/effects';
import { availableCoresCountSelector } from 'common/selectors/application';
import { DECRYPTION_CHUNK_SIZE, ENCRYPTION_CHUNK_SIZE } from 'common/constants';
import { arrayToObject, chunk, match } from 'common/utils/utils';
import {
  increaseCoresCount,
  decreaseCoresCount,
} from 'common/actions/application';

const DECRYPTION = 'decryption';
const DECRYPTION_FINISHED = 'decryption_finished';

const ENCRYPTION = 'encryption';
const ENCRYPTION_FINISHED = 'encryption_finished';

function prepareItemsFor(job, items) {
  if (job === 'decryption') {
    return chunk(items, DECRYPTION_CHUNK_SIZE);
  }

  return null;
}

function getCoresCount(availableCoresCount, chunks) {
  return chunks.length < availableCoresCount
    ? chunks.length
    : availableCoresCount;
}

function* handleDecryptionRequest(chan) {
  while (true) {
    const payload = yield take(chan);
    console.log('handleDecryptionRequest', payload);
    yield put({ type: DECRYPTION_FINISHED });
  }
}

function* handleEncryptionRequest(chan) {
  while (true) {
    const payload = yield take(chan);
    console.log('handleEncryptionRequest', payload);
    yield put({ type: ENCRYPTION_FINISHED });
  }
}

export function* watchRequests() {
  console.log('watchRequests init');

  const chan = yield call(channel);

  yield fork(handleDecryptionRequest, chan);
  yield fork(handleEncryptionRequest, chan);

  while (true) {
    const { type, payload } = yield take([DECRYPTION, ENCRYPTION]);

    const availableCoresCount = yield select(availableCoresCountSelector);

    if (!availableCoresCount) {
      // eslint-disable-next-line
      const { payload } = yield take([DECRYPTION_FINISHED, ENCRYPTION_FINISHED]);
      yield put(increaseCoresCount(payload.coresCount));
    }

    const chunks = prepareItemsFor(type, payload.items);
    const coresCount = getCoresCount(availableCoresCount, chunks);

    yield put(decreaseCoresCount(coresCount));
    // 1) check current available count of cores
    // 2)
    console.log('payload', payload, availableCoresCount, coresCount);

    yield put(chan, payload);
  }
}
