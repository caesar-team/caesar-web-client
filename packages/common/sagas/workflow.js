import {
  put,
  call,
  fork,
  takeLatest,
  take,
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
import {
  addListsBatch,
  ADD_LISTS_BATCH,
} from '@caesar/common/actions/entities/list';
import {
  addItemsBatch,
  createItemRequest,
} from '@caesar/common/actions/entities/item';
import { updateGlobalNotification } from '@caesar/common/actions/application';
import {
  SET_CURRENT_TEAM_ID,
  setCurrentTeamId,
  setPersonalDefaultListId,
} from '@caesar/common/actions/user';
import {
  addTeamKeyPairBatch,
  addShareKeyPairBatch,
  ADD_SHARE_KEY_PAIR_BATCH,
  ADD_TEAM_KEY_PAIR_BATCH,
} from '@caesar/common/actions/keystore';
import { fetchMembersSaga } from '@caesar/common/sagas/entities/member';
import {
  convertNodesToEntities,
  convertItemsToEntities,
  extractRelatedAndNonSystemItems,
} from '@caesar/common/normalizers/normalizers';
import { objectToArray, arrayToObject } from '@caesar/common/utils/utils';
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
  LIST_TYPE,
} from '@caesar/common/constants';
import {
  favoriteListSelector,
  trashListSelector,
  currentTeamTrashListSelector,
  listsByIdSelector,
  defaultListSelector,
  listSelector,
  listsSelector,
  listsIdTeamSelector,
} from '@caesar/common/selectors/entities/list';
import {
  masterPasswordSelector,
  currentTeamIdSelector,
  userIdSelector,
  userPersonalDefaultListIdSelector,
  keyPairSelector,
} from '@caesar/common/selectors/user';
import {
  itemSelector,
  nonDecryptedItemsSelector,
  itemsByIdSelector,
  nonDecryptedSharedItemsSelector,
  nonDecryptedTeamsItemsSelector,
  nonDecryptedListsItemsSelector,
  nonDecryptedTeamItemsSelector,
} from '@caesar/common/selectors/entities/item';
import {
  systemItemsSelector,
  teamSystemItemsSelector,
} from '@caesar/common/selectors/entities/system';
import {
  workInProgressListIdSelector,
  workInProgressItemSelector,
} from '@caesar/common/selectors/workflow';
import {
  personalKeyPairSelector,
  teamKeyPairSelector,
  teamKeyPairsSelector,
  shareKeyPairsSelector,
  shareItemKeyPairSelector,
} from '@caesar/common/selectors/keystore';
import { getFavoritesList } from '@caesar/common/normalizers/utils';
import {
  fetchTeamSuccess,
  addTeamsBatch,
} from '@caesar/common/actions/entities/team';
import { getServerErrorMessage } from '@caesar/common/utils/error';
import { generateSystemItem } from '@caesar/common/sagas/entities/item';
import {
  extractKeysFromSystemItem,
  converSystemItemToKeyPair,
} from '@caesar/common/utils/item';
import {
  teamAdminUsersSelector,
  teamsByIdSelector,
  teamListSelector,
  teamSelector,
} from '@caesar/common/selectors/entities/team';
import { ADD_SYSTEM_ITEMS_BATCH } from '../actions/entities/system';
import { createTeamKeysSaga } from './entities/team';

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
      systemItems[item?.relatedItem?.id || item.id] = item;
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

function* initPersonalVault() {
  try {
    // Init personal keys
    const keyPair = yield select(personalKeyPairSelector);
    const masterPassword = yield select(masterPasswordSelector);

    const {
      data: {
        personal: personalItems = [],
        shared: sharedItems = [],
        teams: { items: teamsItems = { items: [] } },
      },
    } = yield call(getUserItems);

    // Merge all user items in the one array
    const allUserItems = [
      ...(personalItems || []),
      ...(sharedItems || []),
      // ...(teamsItems?.items || []),
    ];

    // Collect all related items from the shared keys
    const relatedItems = allUserItems.filter(item => item.relatedItem !== null);

    // Remove duplicates
    const uniqueItems = {};
    [...allUserItems, ...relatedItems].forEach(item => {
      uniqueItems[item.id] = item;
    });
    // Turn it into an array
    const allItems = Object.values(uniqueItems);

    // Find all system items
    const systemItemsById = buildSystems(allItems);
    // Find all non-system items
    const nonSystemItems = allItems.filter(
      item => item.type !== ITEM_TYPE.SYSTEM,
    );

    // TODO: the server should put the invited into the intem (non-system)
    const personalItemsWithInvited = processingInvitedItem(
      nonSystemItems,
      systemItemsById,
    );

    const { itemsById } = convertItemsToEntities(personalItemsWithInvited);

    const sortedByFavoritesItems = sortItemsByFavorites(
      objectToArray(itemsById),
    );
    const systemItems = objectToArray(systemItemsById);

    // Split the items into personal (can be decrypted by the user keys) and shared (can be decrypted by the shared keys)
    const {
      personalItems: items,
      sharedItems: itemsEcnryptedSharedKeys,
    } = splitSharesAndPersonal(sortedByFavoritesItems);

    yield put(addItemsBatch(itemsEcnryptedSharedKeys));

    const itemsEncryptedUserKeys = [...items, ...systemItems];
    if (itemsEncryptedUserKeys?.length > 0) {
      yield put(
        decryption({
          items: itemsEncryptedUserKeys,
          key: keyPair.privateKey,
          masterPassword,
        }),
      );
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
    const defaultList = lists.find(
      list => list.type === LIST_TYPE.LIST && list.label === LIST_TYPE.DEFAULT,
    );

    // const trashList = lists.find(list => list.type === LIST_TYPE.TRASH);
    const { listsById, itemsById } = convertNodesToEntities(lists);
    const favoritesList = getFavoritesList(itemsById);

    yield put(
      addListsBatch({
        ...listsById,
        [favoritesList.id]: favoritesList,
      }),
    );

    yield put(setPersonalDefaultListId(defaultList.id));

    yield put(resetWorkInProgressItemIds(null));

    // yield put(finishIsLoading());
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
  }
}

function* initListsAndProgressEntities() {
  const currentTeamId = yield select(currentTeamIdSelector);

  const workInProgressListId = yield select(workInProgressListIdSelector);
  const listsById = yield select(listsByIdSelector);
  const favoritesList = yield select(favoriteListSelector);
  const defaultList = yield select(defaultListSelector);

  if (
    !workInProgressListId ||
    ![currentTeamId, null].includes(listsById[workInProgressListId]?.teamId)
  ) {
    if (favoritesList?.children?.length > 0) {
      yield put(setWorkInProgressListId(favoritesList.id));
    } else {
      yield put(setWorkInProgressListId(defaultList.id));
    }
  }

  const workInProgressItem = yield select(workInProgressItemSelector);

  if (
    !workInProgressItem ||
    ![currentTeamId, null].includes(workInProgressItem?.teamId)
  ) {
    yield put(setWorkInProgressItem(null));
  }
}
export function decryptItemsBySystemKeys(items, keyPairs) {
  try {
    const putSagas = items.map(item => {
      const keyPair = keyPairs[item.id];

      if (!keyPair) {
        // eslint-disable-next-line no-console
        console.error(`Can't find the shared key for the item = ${item.id}`);

        return null;
      }

      if (!keyPair) {
        // eslint-disable-next-line no-console
        console.error(
          `Can't extract the key pair from the keyPair for the item = ${item.id}`,
        );

        return null;
      }
      // TODO:  the decryption should be refactor to accept the multiple items and keys

      return put(
        decryption({
          items: [item],
          key: keyPair.privateKey,
          masterPassword: keyPair.pass,
        }),
      );
    });

    return putSagas;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    return [];
  }
}
export function* processTeamItemsSaga({ payload: { teamId } }) {
  try {
    const teamItems = yield select(nonDecryptedTeamsItemsSelector);
    if (teamItems.length <= 0) return;

    const teamKeyPairs = yield select(teamKeyPairSelector, { teamId });

    yield all(decryptItemsBySystemKeys(teamItems, teamKeyPairs));
    yield put(
      decryption({
        items: teamItems,
        key: teamKeyPairs.privateKey,
        masterPassword: teamKeyPairs.pass,
      }),
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

export function* processTeamsItemsSaga() {
  try {
    const teams = yield select(teamListSelector);
    const teamItems = yield select(nonDecryptedTeamsItemsSelector);

    if (teamItems.length <= 0) return;

    const teamKeyPairs = yield all(
      teams.map(team => {
        return select(teamKeyPairSelector, { teamId: team.id });
      }),
    );
    yield all(decryptItemsBySystemKeys(teamItems, teamKeyPairs));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

function* initTeam(teamId) {
  try {
    const currentTeamId = teamId;
    if (!currentTeamId || currentTeamId === TEAM_TYPE.PERSONAL) return;

    const { data: lists } = yield call(getTeamLists, currentTeamId);
    const { listsById, itemsById } = convertNodesToEntities(lists);
    const defaultList = lists.find(list => list.type === LIST_TYPE.DEFAULT);
    const trashList = lists.find(list => list.type === LIST_TYPE.TRASH);
    const favoritesList = getFavoritesList(
      itemsById,
      trashList?.id,
      currentTeamId,
    );

    yield put(
      addListsBatch({
        ...listsById,
        [favoritesList.id]: {
          ...favoritesList,
          type: LIST_TYPE.FAVORITES,
        },
      }),
    );

    yield put(addItemsBatch(itemsById));
    yield call(processTeamItemsSaga, {
      payload: {
        teamId,
      },
    });

    // yield put(fetchTeamSuccess(team));
    // const currentTeamId = yield select(currentTeamIdSelector);
    // const teamAdmins = yield select(teamAdminUsersSelector, {
    //   teamId: team.id,
    // });
    // const currentUserId = yield select(userIdSelector);
    // const isCurrentUserTeamAdmin = teamAdmins.includes(currentUserId);
    // const { data: lists } = yield call(getTeamLists, team.id);
    // const { listsById, itemsById } = convertNodesToEntities(lists);
    // const defaultList = lists.find(list => list.type === LIST_TYPE.DEFAULT);
    // const trashList = lists.find(list => list.type === LIST_TYPE.TRASH);
    // const favoritesList = getFavoritesList(
    //   itemsById,
    //   trashList?.id,
    //   currentTeamId,
    // );
    // yield put(
    //   addListsBatch({
    //     ...listsById,
    //     [favoritesList.id]: favoritesList,
    //   }),
    // );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
  }
}

function* initTeams(withDecryption) {
  try {
    // Load avaible teams
    const { data: teams } = yield call(getTeams);
    const teamById = arrayToObject(teams);
    yield put(addTeamsBatch(teamById));

    // yield all(teams.map(({ id }) => call(initTeam, id, false)));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
  }
}

export function* initWorkflow({ payload: { withDecryption = true } }) {
  yield call(initPersonalVault);
  yield call(initTeams);
  const currentTeamId = yield select(currentTeamIdSelector);
  if (currentTeamId) {
    yield call(initTeam, currentTeamId);
  }
  yield put(
    setCurrentTeamId(currentTeamId || TEAM_TYPE.PERSONAL, withDecryption),
  );
  yield fork(fetchMembersSaga);
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

export function* openTeamVaultSaga({ payload: { teamId } }) {
  try {
    const team = yield select(teamSelector, { teamId });
    const listsById = yield select(listsByIdSelector);
    const lists = objectToArray(listsById);
    const defaultList = lists.find(list => list.type === LIST_TYPE.DEFAULT);
    // const trashList = lists.find(list => list.type === LIST_TYPE.TRASH);
    const favoritesList = lists.find(list => list.type === LIST_TYPE.FAVORITES);

    const workInProgressListId = yield select(workInProgressListIdSelector);
    if (
      !workInProgressListId ||
      listsById[workInProgressListId]?.teamId !== teamId
    ) {
      if (favoritesList?.children?.length > 0) {
        yield put(setWorkInProgressListId(favoritesList.id));
      } else {
        yield put(setWorkInProgressListId(defaultList?.id));
      }
    }
    const workInProgressItem = yield select(workInProgressItemSelector);
    if (!workInProgressItem || workInProgressItem?.teamId !== teamId) {
      yield put(setWorkInProgressItem(null));
    }
    yield put(resetWorkInProgressItemIds(null));
    const keyPair = yield select(teamKeyPairSelector, { teamId: team.id });
    if (!keyPair && team.id) {
      // eslint-disable-next-line no-console
      console.warn(
        `The key pair for the team ${team.name} not found. Creating a new one...`,
      );
      yield call(createTeamKeysSaga, { payload: { team } });
    }
    yield put(finishIsLoading());
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
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
      yield call(openTeamVaultSaga, {
        payload: {
          teamId: currentTeamId,
        },
      });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
  }
}
function* getItemKeyPair({
  payload: {
    item: { id: itemId, teamId, isShared },
  },
}) {
  switch (true) {
    case teamId:
      return yield select(teamKeyPairSelector, { teamId });
    case isShared:
      return yield select(shareItemKeyPairSelector, { itemId });

    default:
      return yield select(personalKeyPairSelector);
  }
}
function* decryptItemRaws({ payload: { item } }) {
  try {
    // If item is null or aready had decypted attachments then do not dectrypt again!
    if (!item || (item.data.raws && Object.values(item.data.raws) > 0)) return;

    const { raws } = JSON.parse(item.secret);

    const keyPair = yield call(getItemKeyPair, {
      payload: {
        item,
      },
    });

    const masterPassword =
      !item.teamId && !item.isShared
        ? yield select(masterPasswordSelector)
        : keyPair.pass;

    yield put(
      decryption({
        raws,
        key: keyPair.privateKey,
        masterPassword,
      }),
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error: ', error);
  }
}
function setWorkInProgressItemSaga({ payload: { item } }) {
  try {
    if (!item) return;

    decryptItemRaws({
      payload: {
        item,
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error: ', error);
  }
}

export function* processSystemItemsSaga({ payload: { itemsById } }) {
  try {
    const items = objectToArray(itemsById);
    if (!items) return;
    const systemItems = items.filter(item => item.type === ENTITY_TYPE.SYSTEM);

    if (systemItems.length > 0) {
      const teamKeys = [];
      const shareKeys = [];
      systemItems.forEach(item => {
        if (!item.data?.name) return null;

        return REGEXP_TESTER.SYSTEM.IS_TEAM(item.data?.name)
          ? teamKeys.push(item)
          : shareKeys.push(item);
      });

      yield all([
        put(addTeamKeyPairBatch(teamKeys)),
        put(addShareKeyPairBatch(shareKeys)),
      ]);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

export function* processSharedItemsSaga() {
  try {
    const keyPairs = yield select(shareKeyPairsSelector);
    const sharedItems = yield select(nonDecryptedSharedItemsSelector);

    yield all(decryptItemsBySystemKeys(sharedItems, keyPairs));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

export function* processListsSaga({ payload: { listById } }) {
  try {
    const list = objectToArray(listById);
    if (!list) return;
    const systemItems = items.filter(item => item.type === ENTITY_TYPE.SYSTEM);

    if (systemItems.length > 0) {
      const teamKeys = [];
      const shareKeys = [];
      systemItems.forEach(item => {
        if (!item.data?.name) return null;

        return REGEXP_TESTER.SYSTEM.IS_TEAM(item.data?.name)
          ? teamKeys.push(item)
          : shareKeys.push(item);
      });

      yield all([
        put(addTeamKeyPairBatch(teamKeys)),
        put(addShareKeyPairBatch(shareKeys)),
      ]);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

export default function* workflowSagas() {
  // Init (get all items, keys, etc)
  yield takeLatest(INIT_WORKFLOW, initWorkflow);
  yield takeEvery(ADD_SYSTEM_ITEMS_BATCH, processSystemItemsSaga);
  yield takeEvery(ADD_SHARE_KEY_PAIR_BATCH, processSharedItemsSaga);
  // yield takeEvery(ADD_TEAM_KEY_PAIR_BATCH, processTeamItemsSaga);
  yield takeLatest(SET_WORK_IN_PROGRESS_ITEM, setWorkInProgressItemSaga);
  yield takeLatest(ADD_LISTS_BATCH, initListsAndProgressEntities);
  yield takeLatest(UPDATE_WORK_IN_PROGRESS_ITEM, updateWorkInProgressItemSaga);
  yield takeLatest(SET_CURRENT_TEAM_ID, setCurrentTeamIdWatchSaga);
}
