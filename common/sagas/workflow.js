import { take, put, call, takeLatest, select, all } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import {
  FETCH_NODES_REQUEST,
  fetchNodesFailure,
  fetchNodesSuccess,
  finishIsLoading,
  setWorkInProgressListId,
} from 'common/actions/workflow';
import { addListsBatch } from 'common/actions/list';
import { addItemsBatch } from 'common/actions/item';
import { addChildItemsBatch } from 'common/actions/childItem';
import { convertNodesToEntities } from 'common/normalizers/normalizers';
import { favoriteListSelector } from 'common/selectors/list';
import { getWorkersCount } from 'common/utils/worker';
import { uuid4 } from 'common/utils/uuid4';
import DecryptWorker from 'common/decryption.worker';
import { keyPairSelector, masterPasswordSelector } from 'common/selectors/user';
import { getList } from 'common/api';

const chunk = (input, size) => {
  return input.reduce((arr, item, idx) => {
    return idx % size === 0
      ? [...arr, [item]]
      : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]];
  }, []);
};

const objectToArray = obj => Object.values(obj);

const arrayToObject = arr =>
  arr.reduce((accumulator, item) => ({ ...accumulator, [item.id]: item }), {});

const getWorkerEvents = workerId => ({
  eventToWorker: `decryptItems_${workerId}`,
  eventFromWorker: `emitDecryptedItems_${workerId}`,
});

function createWebWorkerChannel(data) {
  const workerId = uuid4();
  const worker = new DecryptWorker();
  const workerEvents = getWorkerEvents(workerId);

  worker.postMessage({
    event: workerEvents.eventToWorker,
    data: { events: workerEvents, ...data },
  });

  return eventChannel(emitter => {
    // eslint-disable-next-line
    worker.onmessage = ({ data: { event, items } }) => {
      if (event === workerEvents.eventFromWorker) {
        emitter(items);
      }
    };

    return () => worker.terminate();
  });
}

export function* decryptionSaga(itemsById) {
  const keyPair = yield select(keyPairSelector);
  const masterPassword = yield select(masterPasswordSelector);

  const channel = yield call(createWebWorkerChannel, {
    items: objectToArray(itemsById).map(({ id, secret }) => ({ id, secret })),
    privateKey: keyPair.privateKey,
    masterPassword,
  });

  while (channel) {
    try {
      const decryptedItems = yield take(channel);

      const preparedItems = decryptedItems.reduce(
        (accumulator, { id, secret }) => ({
          ...accumulator,
          [id]: {
            ...itemsById[id],
            secret,
          },
        }),
        {},
      );

      yield put(addItemsBatch(preparedItems));

      // TODO: find better place
      yield put(finishIsLoading());
    } catch (error) {
      console.log(error);
    }
  }
}

export function* fetchNodesSaga({ payload: { withItemsDecryption } }) {
  try {
    const { data } = yield call(getList);

    const { listsById, itemsById, childItemsById } = convertNodesToEntities(
      data,
    );

    console.log(listsById, itemsById, childItemsById);

    yield put(addListsBatch(listsById));
    yield put(addChildItemsBatch(childItemsById));

    yield put(fetchNodesSuccess(listsById));

    const favoriteList = yield select(favoriteListSelector);

    yield put(setWorkInProgressListId(favoriteList.id));

    if (withItemsDecryption) {
      const items = objectToArray(itemsById);

      if (items.length) {
        const preparedItems = items.sort(
          (a, b) => Number(b.favorite) - Number(a.favorite),
        );
        const poolSize = getWorkersCount();
        const chunks = chunk(preparedItems, Math.ceil(items.length / poolSize));

        yield all(
          chunks.map(chunkItems =>
            call(decryptionSaga, arrayToObject(chunkItems)),
          ),
        );
      } else {
        yield put(finishIsLoading());
      }
    } else {
      yield put(addItemsBatch(itemsById));
      yield put(finishIsLoading());
    }
  } catch (error) {
    console.log(error);
    yield put(fetchNodesFailure());
  }
}

export default function* workflowSagas() {
  yield takeLatest(FETCH_NODES_REQUEST, fetchNodesSaga);
}
