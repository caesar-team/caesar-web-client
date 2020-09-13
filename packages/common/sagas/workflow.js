import {
  put,
  call,
  fork,
  takeLatest,
  takeEvery,
  select,
  all,
} from 'redux-saga/effects';
import {
  INIT_WORKFLOW,
  UPDATE_WORK_IN_PROGRESS_ITEM,
  SET_WORK_IN_PROGRESS_ITEM,
  DECRYPTION_END,
  finishIsLoading,
  setWorkInProgressListId,
  setWorkInProgressItem,
  resetWorkInProgressItemIds,
  decryption,
} from '@caesar/common/actions/workflow';
import { addListsBatch } from '@caesar/common/actions/entities/list';
import {
  addItemsBatch,
  createItemRequest,
} from '@caesar/common/actions/entities/item';
import { updateGlobalNotification } from '@caesar/common/actions/application';
import {
  SET_CURRENT_TEAM_ID,
  setCurrentTeamId,
} from '@caesar/common/actions/user';
import {
  addTeamKeyPair,
  addShareKeyPair,, ADD_SHARE_KEY_PAIR
} from '@caesar/common/actions/keyStore';
import { fetchMembersSaga } from '@caesar/common/sagas/entities/member';
import {
  convertNodesToEntities,
  convertItemsToEntities,
  extractRelatedAndNonSystemItems,
} from '@caesar/common/normalizers/normalizers';
import { objectToArray } from '@caesar/common/utils/utils';
import { sortItemsByFavorites } from '@caesar/common/utils/workflow';
import {
  getLists,
  getTeamLists,
  getTeams,
  getUserItems,
} from '@caesar/common/api';
import {
  ENTITY_TYPE,
  ITEM_TYPE,
  REGEXP_TESTER,
  TEAM_TYPE,
} from '@caesar/common/constants';
import {
  favoriteListSelector,
  trashListSelector,
  currentTeamTrashListSelector,
} from '@caesar/common/selectors/entities/list';
import {
  masterPasswordSelector,
  currentTeamIdSelector,
  userIdSelector,
  userPersonalDefaultListIdSelector,
} from '@caesar/common/selectors/user';
import { itemSelector } from '@caesar/common/selectors/entities/item';
import { systemItemsSelector } from '@caesar/common/selectors/entities/system';
import {
  workInProgressListIdSelector,
  workInProgressItemSelector,
} from '@caesar/common/selectors/workflow';
import {
  personalKeyPairSelector,
  teamKeyPairSelector,
  shareKeysPairSelector,
} from '@caesar/common/selectors/keyStore';
import { getFavoritesList } from '@caesar/common/normalizers/utils';
import { fetchTeamSuccess } from '@caesar/common/actions/entities/team';
import { getServerErrorMessage } from '@caesar/common/utils/error';
import { generateSystemItem } from '@caesar/common/sagas/entities/item';
import { extractKeysFromSystemItem } from '@caesar/common/utils/item';
import { teamAdminUsersSelector } from '@caesar/common/selectors/entities/team';
import { ADD_SYSTEM_ITEMS_BATCH } from '../actions/entities/system';

const splitSharesAndPersonal = items => {
  const personalItems = items.filter(item => !item.isShared);
  const sharedItems = items.filter(item => item.isShared);

  return {
    personalItems,
    sharedItems,
  };
};
const buildSystems = items => {
  const systemItems = {};
  items.forEach(item => {
    if (item.type === ITEM_TYPE.SYSTEM) {
      systemItems[item.relatedItem.id] = item;
    }
  });

  return systemItems;
};
const processingInvitedItem = (items, systemItemsById) => {
  return items.map(item =>
    systemItemsById[item.id]
      ? {
          ...item,
          invited: systemItemsById[item.id].invited,
          isShared: systemItemsById[item.id]?.invited?.length > 0,
        } // Set invited from the system item
      : item,
  );
};

function* decryptionSharedItems(itemsEcnryptedSharedKeys) {
  const keyPairsForSharedItems = yield select(shareKeysPairSelector, {
    ids: itemsEcnryptedSharedKeys.map(item => item.id),
  });

  const ecnryptedSagas = itemsEcnryptedSharedKeys.map(item => {
    const sharedKeyPair = keyPairsForSharedItems[item.id];

    if (!sharedKeyPair || '' in sharedKeyPair) {
      // eslint-disable-next-line no-console
      console.error(`Can't find the keypair for the item ${item.id}`);

      return null;
    }

    return put(
      decryption({
        items: [item],
        key: sharedKeyPair.privateKey,
        masterPassword: sharedKeyPair.pass,
      }),
    );
  });

  return yield all(ecnryptedSagas);
}
function* initPersonalVault() {
  try {
    const keyPair = yield select(personalKeyPairSelector);
    const masterPassword = yield select(masterPasswordSelector);

    const {
      data: {
        personal: personalItems = [],
        shared: sharedItems = [],
        teams: teamsItems = [],
      },
    } = yield call(getUserItems);
    const allUserItems = [
      ...(personalItems || []),
      ...(sharedItems || []),
      ...(teamsItems?.items || []),
    ];
    const relatedItems = allUserItems.filter(item => item.relatedItem !== null);
    const uniqueItems = {};
    [...allUserItems, ...relatedItems].forEach(item => {
      uniqueItems[item.id] = item;
    });
    const allItems = Object.values(uniqueItems);
    const systemItemsById = buildSystems(allItems);
    const nonSystemItems = allItems.filter(
      item => item.type !== ITEM_TYPE.SYSTEM,
    );

    const personalItemsWithInvited = processingInvitedItem(
      nonSystemItems,
      systemItemsById,
    );

    const { itemsById } = convertItemsToEntities(personalItemsWithInvited);

    const sortedByFavoritesItems = sortItemsByFavorites(
      objectToArray(itemsById),
    );
    const systemItems = objectToArray(systemItemsById);
    const {
      personalItems: items,
      sharedItems: itemsEcnryptedSharedKeys,
    } = splitSharesAndPersonal(sortedByFavoritesItems);

    const itemsEncryptedUserKeys = [...items, ...systemItems];
    if (itemsEncryptedUserKeys?.length > 0) {
      yield put(
        decryption({
          items: itemsEncryptedUserKeys,
          key: keyPair.privateKey,
          masterPassword,
        }),
      );
      yield call(decryptionSharedItems, itemsEcnryptedSharedKeys);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
  }
}

function* openPersonalVault() {
  try {
    const currentTeamId = yield select(currentTeamIdSelector);

    if (currentTeamId !== TEAM_TYPE.PERSONAL) {
      return;
    }

    const { data: rawLists } = yield call(getLists);
    const lists = extractRelatedAndNonSystemItems(rawLists);
    const { itemsById } = convertNodesToEntities(lists);

    const trashList = yield select(trashListSelector);
    let favoritesList = yield select(favoriteListSelector);

    if (!favoritesList?.id) {
      favoritesList = getFavoritesList(itemsById, trashList?.id);
    }

    // yield put(setPersonalDefaultListId(defaultList.id));
    // yield put(
    //   addListsBatch({
    //     ...listsById,
    //     [favoritesList.id]: favoritesList,
    //   }),
    // );

    // const workInProgressListId = yield select(workInProgressListIdSelector);

    // if (
    //   !workInProgressListId ||
    //   ![currentTeamId, null].includes(listsById[workInProgressListId]?.teamId)
    // ) {
    //   yield put(setWorkInProgressListId(favoritesList.id));
    // }

    // const workInProgressItem = yield select(workInProgressItemSelector);

    // if (
    //   !workInProgressItem ||
    //   ![currentTeamId, null].includes(workInProgressItem?.teamId)
    // ) {
    //   yield put(setWorkInProgressItem(null));
    // }

    // yield put(resetWorkInProgressItemIds(null));

    yield put(finishIsLoading());
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
  }
}

function* initTeam(team, withDecryption) {
  try {
    yield put(fetchTeamSuccess(team));

    const currentTeamId = yield select(currentTeamIdSelector);

    if (currentTeamId === TEAM_TYPE.PERSONAL || currentTeamId !== team.id) {
      return;
    }

    const teamAdmins = yield select(teamAdminUsersSelector, {
      teamId: team.id,
    });
    const currentUserId = yield select(userIdSelector);
    const isCurrentUserTeamAdmin = teamAdmins.includes(currentUserId);
    const { data: lists } = yield call(getTeamLists, team.id);
    const { listsById, itemsById } = convertNodesToEntities(lists);

    const trashList = yield select(currentTeamTrashListSelector);
    const favoritesList = getFavoritesList(
      itemsById,
      trashList?.id,
      currentTeamId,
    );

    yield put(
      addListsBatch({
        ...listsById,
        [favoritesList.id]: favoritesList,
      }),
    );

    const workInProgressListId = yield select(workInProgressListIdSelector);

    if (
      !workInProgressListId ||
      listsById[workInProgressListId]?.teamId !== currentTeamId
    ) {
      yield put(setWorkInProgressListId(favoritesList.id));
    }

    const workInProgressItem = yield select(workInProgressItemSelector);

    if (!workInProgressItem || workInProgressItem?.teamId !== currentTeamId) {
      yield put(setWorkInProgressItem(null));
    }

    yield put(resetWorkInProgressItemIds(null));

    let teamKeyPair = yield select(teamKeyPairSelector, { teamId: team.id });

    if (!teamKeyPair.privateKey && isCurrentUserTeamAdmin) {
      const userPersonalDefaultListId = yield select(
        userPersonalDefaultListIdSelector,
      );
      const teamSystemItem = yield call(
        generateSystemItem,
        ENTITY_TYPE.TEAM,
        userPersonalDefaultListId,
        team.id,
      );

      teamKeyPair = {
        ...extractKeysFromSystemItem(teamSystemItem),
        pass: teamSystemItem.pass,
      };

      yield put(addTeamKeyPair(teamSystemItem));
      yield put(createItemRequest(teamSystemItem));
    }

    if (currentTeamId === team.id && withDecryption) {
      const items = objectToArray(itemsById);

      if (items?.length > 0 && teamKeyPair.privateKey) {
        yield put(
          decryption({
            items,
            key: teamKeyPair.privateKey,
            masterPassword: teamKeyPair.pass,
          }),
        );
      }
    } else {
      yield put(addItemsBatch(itemsById));
    }

    yield put(finishIsLoading());
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
  }
}

function* initTeams(withDecryption) {
  try {
    const { data: teams } = yield call(getTeams);

    yield all(teams.map(team => call(initTeam, team, withDecryption)));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
  }
}

export function* initWorkflow({ payload: { withDecryption = true } }) {
  yield call(initPersonalVault);
  // yield call(initKeyStore);
  // const currentTeamId = yield select(currentTeamIdSelector);

  // yield put(
  //   setCurrentTeamId(currentTeamId || TEAM_TYPE.PERSONAL, withDecryption),
  // );
  // yield fork(fetchMembersSaga);
}

export function* updateWorkInProgressItemSaga({ payload: { itemId } }) {
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

    yield put(setWorkInProgressItem(item));
  }
}

export function* setCurrentTeamIdWatchSaga({
  payload: { withDecryption = true },
}) {
  try {
    const currentTeamId = yield select(currentTeamIdSelector);

    if (!currentTeamId) return;

    if (currentTeamId === TEAM_TYPE.PERSONAL) {
      yield call(openPersonalVault, withDecryption);
    } else {
      yield call(initTeams, withDecryption);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
  }
}

export function* decryptionEndWatchSaga({ payload: { items } }) {
  try {
    console.log('decryptionEndWatchSaga', items);

    const systemItems = yield select(systemItemsSelector);
    const systemItemsArray = objectToArray(systemItems);

    // if (systemItemsArray.length > 0) {
    //   yield all(
    //     systemItemsArray.map(item =>
    //       item.data?.name?.includes(ENTITY_TYPE.TEAM)
    //         ? put(addTeamKeyPair(item))
    //         : put(addShareKeyPair(item)),
    //     ),
    //   );
    // }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

function* setWorkInProgressItemSaga({ payload: { item } }) {
  try {
    if (!item) return;
    const { raws } = JSON.parse(item.secret);

    if (raws) {
      const keyPair = yield select(personalKeyPairSelector);
      const masterPassword = yield select(masterPasswordSelector);

      yield put(
        decryption({
          raws,
          key: keyPair.privateKey,
          masterPassword,
        }),
      );
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error: ', error);
  }
}

export function* processSystemItemsSaga({ payload: { items } }) {
  try {
    console.log('decryptionEndWatchSaga', items);

    const systemItems = items.filter(item => (item.type = ENTITY_TYPE.SYSTEM));

    if (systemItems.length > 0) {
      const putSagas = systemItems.map(item => {
        if (!item.data?.name) return null;

        return REGEXP_TESTER.SYSTEM.IS_TEAM(item.data?.name)
          ? put(addTeamKeyPair(item))
          : put(addShareKeyPair(item));
      });

      yield all(putSagas);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

export function* processSharedItemsSaga({ payload: { keyPair } }) {
  try {
    console.log('processSharedItemsSaga', keyPair);

    
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

export default function* workflowSagas() {
  yield takeLatest(INIT_WORKFLOW, initWorkflow);
  yield takeLatest(UPDATE_WORK_IN_PROGRESS_ITEM, updateWorkInProgressItemSaga);
  yield takeLatest(SET_CURRENT_TEAM_ID, setCurrentTeamIdWatchSaga);
  yield takeEvery(DECRYPTION_END, decryptionEndWatchSaga);
  yield takeEvery(ADD_SYSTEM_ITEMS_BATCH, processSystemItemsSaga);
  yield takeEvery(ADD_SHARE_KEY_PAIR, processSharedItemsSaga)
  yield takeLatest(SET_WORK_IN_PROGRESS_ITEM, setWorkInProgressItemSaga);
}
