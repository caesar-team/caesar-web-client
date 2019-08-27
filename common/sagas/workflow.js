import { take, put, call, takeLatest, select, all } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import {
  FETCH_NODES_REQUEST,
  UPDATE_WORK_IN_PROGRESS_ITEM,
  REHYDRATE_STORE,
  fetchNodesFailure,
  fetchNodesSuccess,
  finishIsLoading,
  setWorkInProgressListId,
  setWorkInProgressItem,
} from 'common/actions/workflow';
import { addListsBatch } from 'common/actions/list';
import { addItemsBatch } from 'common/actions/item';
import { addChildItemsBatch } from 'common/actions/childItem';
import { convertNodesToEntities } from 'common/normalizers/normalizers';
import { getWorkersCount } from 'common/utils/worker';
import { uuid4 } from 'common/utils/uuid4';
import DecryptWorker from 'common/decryption.worker';
import { getList } from 'common/api';
import { ITEM_REVIEW_MODE } from 'common/constants';
import { favoriteListSelector } from 'common/selectors/list';
import { keyPairSelector, masterPasswordSelector } from 'common/selectors/user';
import { itemsByIdSelector, itemSelector } from 'common/selectors/item';
import { workInProgressItemSelector } from 'common/selectors/workflow';
import { isOnlineSelector } from 'common/selectors/offline';

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

export function* decryptionChunkItemsSaga(itemsById) {
  const keyPair = yield select(keyPairSelector);
  const masterPassword = yield select(masterPasswordSelector);

  const webWorkerChannel = yield call(createWebWorkerChannel, {
    items: objectToArray(itemsById).map(({ id, secret }) => ({ id, secret })),
    privateKey: keyPair.privateKey,
    masterPassword,
  });

  while (webWorkerChannel) {
    try {
      const decryptedItems = yield take(webWorkerChannel);
      const preparedItems = decryptedItems.reduce(
        (accumulator, { id, data }) => ({
          ...accumulator,
          [id]: {
            ...itemsById[id],
            data,
          },
        }),
        {},
      );

      yield put(addItemsBatch, preparedItems);

      yield put(finishIsLoading());
    } catch (error) {
      console.log(error);
    }
  }
}

function* decryptionItems({ payload: { itemsById } }) {
  const items = objectToArray(itemsById);

  if (items.length) {
    const preparedItems = items.sort(
      (a, b) => Number(b.favorite) - Number(a.favorite),
    );
    const poolSize = getWorkersCount();
    const chunks = chunk(preparedItems, Math.ceil(items.length / poolSize));

    yield all(
      chunks.map(chunkItems =>
        call(decryptionChunkItemsSaga, arrayToObject(chunkItems)),
      ),
    );
  } else {
    yield put(finishIsLoading());
  }
}

export function* fetchNodesSaga({ payload: { withItemsDecryption } }) {
  try {
    const { data } = yield call(getList);

    const { listsById, itemsById, childItemsById } = convertNodesToEntities(
      data,
    );

    yield put(addListsBatch(listsById));
    yield put(addChildItemsBatch(childItemsById));

    yield put(fetchNodesSuccess(listsById));

    const favoriteList = yield select(favoriteListSelector);

    yield put(setWorkInProgressListId(favoriteList.id));

    if (withItemsDecryption) {
      yield call(decryptionItems, { payload: { itemsById } });
    } else {
      yield put(addItemsBatch(itemsById));
      yield put(finishIsLoading());
    }
  } catch (error) {
    console.log(error);
    yield put(fetchNodesFailure());
  }
}

export function* updateWorkInProgressItemSaga({
  payload: { itemId, mode = ITEM_REVIEW_MODE },
}) {
  let id = null;

  if (!itemId) {
    const workInProgressItem = yield select(workInProgressItemSelector);

    if (workInProgressItem) {
      id = workInProgressItem.id;
    }
  } else {
    id = itemId;
  }

  if (id) {
    const item = yield select(itemSelector, { itemId: id });

    yield put(setWorkInProgressItem(item, mode));
  }
}

export function* rehydrateStoreSaga() {
  try {
    const isOnline = yield select(isOnlineSelector);

    if (!isOnline) {
      const itemsById = yield select(itemsByIdSelector);
      yield call(decryptionItems, { payload: { itemsById } });
    }
  } catch (error) {
    console.log(error);
  }
}

export default function* workflowSagas() {
  yield takeLatest(FETCH_NODES_REQUEST, fetchNodesSaga);
  yield takeLatest(UPDATE_WORK_IN_PROGRESS_ITEM, updateWorkInProgressItemSaga);
  yield takeLatest(REHYDRATE_STORE, rehydrateStoreSaga);
}
