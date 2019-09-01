import {
  take,
  put,
  call,
  fork,
  takeLatest,
  select,
  all,
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import {
  INIT_PREPARATION_DATA_FLOW,
  UPDATE_WORK_IN_PROGRESS_ITEM,
  REHYDRATE_STORE,
  finishIsLoading,
  setWorkInProgressListId,
  setWorkInProgressItem,
} from 'common/actions/workflow';
import { addListsBatch } from 'common/actions/list';
import { addItemsBatch } from 'common/actions/item';
import { addChildItemsBatch } from 'common/actions/childItem';
import { fetchMembersSaga } from 'common/sagas/member';
import { convertNodesToEntities } from 'common/normalizers/normalizers';
import { getWorkersCount } from 'common/utils/worker';
import { uuid4 } from 'common/utils/uuid4';
import { chunk, objectToArray, arrayToObject } from 'common/utils/utils';
import { sortItemsByFavorites, getMembersIds } from 'common/utils/workflow';
import DecryptWorker from 'common/decryption.worker';
import { getList } from 'common/api';
import { ITEM_REVIEW_MODE } from 'common/constants';
import { favoriteListSelector } from 'common/selectors/list';
import { keyPairSelector, masterPasswordSelector } from 'common/selectors/user';
import { itemsByIdSelector, itemSelector } from 'common/selectors/item';
import { workInProgressItemSelector } from 'common/selectors/workflow';
import { isOnlineSelector } from 'common/selectors/offline';

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

      yield put(addItemsBatch(preparedItems));

      yield put(finishIsLoading());
    } catch (error) {
      console.log(error);
    }
  }
}

function* decryptionItems(items) {
  if (items.length) {
    const poolSize = getWorkersCount();
    const chunks = chunk(items, Math.ceil(items.length / poolSize));

    yield all(
      chunks.map(chunkItems =>
        call(decryptionChunkItemsSaga, arrayToObject(chunkItems)),
      ),
    );
  } else {
    yield put(finishIsLoading());
  }
}

export function* initPersonalData({ payload: { withItemsDecryption } }) {
  try {
    const { data } = yield call(getList);

    const { listsById, itemsById, childItemsById } = convertNodesToEntities(
      data,
    );

    yield fork(fetchMembersSaga, {
      payload: { memberIds: getMembersIds(itemsById, childItemsById) },
    });

    yield put(addListsBatch(listsById));
    yield put(addChildItemsBatch(childItemsById));

    if (withItemsDecryption) {
      yield fork(
        decryptionItems,
        sortItemsByFavorites(objectToArray(itemsById)),
      );
    } else {
      yield put(addItemsBatch(itemsById));
      yield put(finishIsLoading());
    }

    const favoriteList = yield select(favoriteListSelector);
    yield put(setWorkInProgressListId(favoriteList.id));
  } catch (error) {
    console.log(error);
  }
}

export function* initTeamData() {
  try {
    yield 'test';
  } catch (error) {
    console.log(error);
  }
}

export function* initPreparationDataFlowSaga({
  payload: { withItemsDecryption },
}) {
  yield fork(initPersonalData, { payload: { withItemsDecryption } });
  yield fork(initTeamData);
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
  yield takeLatest(INIT_PREPARATION_DATA_FLOW, initPreparationDataFlowSaga);
  yield takeLatest(UPDATE_WORK_IN_PROGRESS_ITEM, updateWorkInProgressItemSaga);
  yield takeLatest(REHYDRATE_STORE, rehydrateStoreSaga);
}
