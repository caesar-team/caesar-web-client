import {
  put,
  call,
  fork,
  take,
  takeLatest,
  takeEvery,
  select,
  all,
} from 'redux-saga/effects';
import {
  INIT_WORKFLOW,
  UPDATE_WORK_IN_PROGRESS_ITEM,
  SET_WORK_IN_PROGRESS_ITEM,
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
  removeItemsBatch,
} from '@caesar/common/actions/entities/item';
import { updateGlobalNotification } from '@caesar/common/actions/application';
import {
  SET_CURRENT_TEAM_ID,
  setCurrentTeamId,
  FETCH_USER_SELF_SUCCESS,
} from '@caesar/common/actions/user';
import {
  addTeamKeyPairBatch,
  addShareKeyPairBatch,
  ADD_TEAM_KEY_PAIR_BATCH,
} from '@caesar/common/actions/keystore';
import { fetchUserSelfSaga } from '@caesar/common/sagas/user';
import { fetchMembersSaga } from '@caesar/common/sagas/entities/member';
import {
  convertNodesToEntities,
  convertItemsToEntities,
  convertTeamsToEntity,
  convertListsToEntities,
} from '@caesar/common/normalizers/normalizers';
import { objectToArray } from '@caesar/common/utils/utils';
import { upperFirst } from '@caesar/common/utils/string';
import { itemsByFavoritesSort } from '@caesar/common/utils/workflow';
import {
  getLists,
  getTeamLists,
  getUserItems,
  getUserTeams,
} from '@caesar/common/api';
import {
  ENTITY_TYPE,
  ITEM_TYPE,
  REGEXP_TESTER,
  TEAM_TYPE,
  LIST_TYPE,
  ROLE_ADMIN,
} from '@caesar/common/constants';
import {
  favoriteListSelector,
  listsByIdSelector,
  defaultListSelector,
  listsTeamSelector,
} from '@caesar/common/selectors/entities/list';
import {
  userDataSelector,
  masterPasswordSelector,
  currentTeamIdSelector,
} from '@caesar/common/selectors/user';
import {
  itemSelector,
  nonDecryptedSharedItemsSelector,
  nonDecryptedTeamItemsSelector,
  nonDecryptedTeamsItemsSelector,
} from '@caesar/common/selectors/entities/item';
import {
  workInProgressListIdSelector,
  workInProgressItemSelector,
} from '@caesar/common/selectors/workflow';
import {
  personalKeyPairSelector,
  teamKeyPairSelector,
  shareKeyPairsSelector,
  shareItemKeyPairSelector,
} from '@caesar/common/selectors/keystore';
import { getFavoritesList } from '@caesar/common/normalizers/utils';
import { addTeamsBatch } from '@caesar/common/actions/entities/team';
import { getServerErrorMessage } from '@caesar/common/utils/error';
import {
  teamListSelector,
  teamSelector,
} from '@caesar/common/selectors/entities/team';
import { ADD_SYSTEM_ITEMS_BATCH } from '@caesar/common/actions/entities/system';

export function decryptItemsByItemIdKeys(items, keyPairs) {
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

      const { privateKey, password } = keyPair;

      return put(
        decryption({
          items: [item],
          key: privateKey,
          masterPassword: password,
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

export function* processSharedItemsSaga() {
  try {
    const keyPairs = yield select(shareKeyPairsSelector);
    const sharedItems = yield select(nonDecryptedSharedItemsSelector);

    yield all(
      decryptItemsByItemIdKeys(
        sharedItems.filter(sharedItem => keyPairs[sharedItem.id]),
        keyPairs,
      ),
    );

    // Remove undecrypttable items from the store
    yield call(
      removeItemsBatch,
      sharedItems
        .filter(sharedItem => !keyPairs[sharedItem.id])
        .map(sharedItem => sharedItem.id),
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

export function* processTeamItemsSaga({ payload: { teamId } }) {
  try {
    const teamKeyPairs = yield select(teamKeyPairSelector, { teamId });

    if (!teamKeyPairs) {
      const team = yield select(teamSelector, { teamId });
      // eslint-disable-next-line no-console
      console.warn(
        `The key pair for the team ${team.title}:${teamId} not found. Need to create a new one...`,
      );

      // yield call(createTeamKeysSaga, {
      //   payload: { team },
      // });
    }

    const teamItems = yield select(nonDecryptedTeamItemsSelector, { teamId });
    if (teamItems.length <= 0) return;
    yield put(
      decryption({
        items: teamItems,
        key: teamKeyPairs.privateKey,
        masterPassword: teamKeyPairs.password,
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
    yield all(decryptItemsByItemIdKeys(teamItems, teamKeyPairs));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

function* getFavoritesListFromStore(teamId) {
  return (
    (yield select(listsTeamSelector, {
      teamId,
    })).find(list => list.type === LIST_TYPE.FAVORITES) || null
  );
}

function* initTeam(teamId) {
  try {
    const currentTeamId = teamId;

    if (!currentTeamId || currentTeamId === TEAM_TYPE.PERSONAL) return;

    const { data: lists } = yield call(getTeamLists, currentTeamId);
    const { listsById, itemsById } = convertNodesToEntities(lists);
    const trashList = lists.find(list => list.type === LIST_TYPE.TRASH);

    const favoriteListFromStore = yield call(getFavoritesListFromStore, teamId);

    const favoritesList = getFavoritesList({
      favoriteListId: favoriteListFromStore?.id,
      itemsById,
      trashListId: trashList?.id,
      teamId,
    });

    const { listsById: favoritesListById } = convertNodesToEntities([
      favoritesList,
    ]);

    yield put(
      addListsBatch({
        ...listsById,
        ...favoritesListById,
      }),
    );

    yield put(addItemsBatch(itemsById));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
  }
}

export function* openCurrentVaultSaga() {
  const currentTeamId = yield select(currentTeamIdSelector);
  yield put(setCurrentTeamId(currentTeamId || TEAM_TYPE.PERSONAL));
}

function* initTeams() {
  try {
    // Load avaible teams
    const { data: teams } = yield call(getUserTeams);
    yield all(teams.map(({ id }) => fork(initTeam, id, false)));

    const userData = yield select(userDataSelector);

    teams.push({
      id: TEAM_TYPE.PERSONAL,
      title: upperFirst(TEAM_TYPE.PERSONAL),
      type: TEAM_TYPE.PERSONAL,
      icon: userData?.avatar,
      email: userData?.email,
      userRole: ROLE_ADMIN,
      _links: userData?._links,
    });

    const teamById = convertTeamsToEntity(teams);
    yield put(addTeamsBatch(teamById));
    yield call(openCurrentVaultSaga);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
  }
}
const nonSystemItemsFilter = item => item.type !== ITEM_TYPE.SYSTEM;
const systemItemsFilter = item => item.type === ITEM_TYPE.SYSTEM;
function* initPersonalVault() {
  try {
    yield take(FETCH_USER_SELF_SUCCESS);
    // Init personal keys
    const keyPair = yield select(teamKeyPairSelector, {
      teamId: TEAM_TYPE.PERSONAL,
    });

    const {
      data: {
        personal: personalItems = [],
        shared: sharedItems = [],
        teams: teamsItems = [],
      },
    } = yield call(getUserItems);

    // Merge all user items in the one array
    const { itemsById: systemItemsById } = convertItemsToEntities(
      [
        ...(personalItems || []),
        ...(sharedItems || []),
        ...(teamsItems || []),
      ].filter(systemItemsFilter),
    );
    const { itemsById } = convertItemsToEntities(personalItems);
    const { itemsById: sharedItemsById } = convertItemsToEntities(
      sharedItems.filter(nonSystemItemsFilter),
    );
    const { itemsById: teamsItemsById } = convertItemsToEntities(
      teamsItems.filter(nonSystemItemsFilter),
    );

    // Put to the store the shared and the team items
    yield put(addItemsBatch({ ...sharedItemsById, ...teamsItemsById }));

    // Put the system items to decryptions
    const systemItems = objectToArray(systemItemsById);
    if (systemItems?.length > 0) {
      yield put(
        decryption({
          items: systemItems,
          key: keyPair.privateKey,
          masterPassword: keyPair.password,
        }),
      );
    }

    // Put the user items to decryptions
    const userItems = objectToArray(itemsById).sort(itemsByFavoritesSort);

    if (userItems?.length > 0) {
      yield put(
        decryption({
          items: userItems,
          key: keyPair.privateKey,
          masterPassword: keyPair.password,
        }),
      );
    }

    const teamId = TEAM_TYPE.PERSONAL;

    // Load lists
    const { data: lists } = yield call(getLists);
    const { listsById } = convertListsToEntities(lists);
    const trashList = lists.find(list => list.type === LIST_TYPE.TRASH);

    const favoriteListFromStore = yield call(getFavoritesListFromStore, teamId);

    const favoritesList = getFavoritesList({
      favoriteListId: favoriteListFromStore?.id,
      itemsById: listsById,
      trashListId: trashList?.id,
      teamId,
    });

    const { listsById: favoritesListById } = convertListsToEntities([
      favoritesList,
    ]);
    yield put(
      addListsBatch({
        ...listsById,
        ...favoritesListById,
      }),
    );

    if (!systemItems?.length) {
      // Empty the personal vault or without system items, passtrought call of initTeams();
      yield call(initTeams);
    }
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

export function* initWorkflow() {
  yield fork(fetchUserSelfSaga);
  yield fork(initPersonalVault);

  // We need to wait for the decryption of team keypair to initiate the Teams
  yield fork(fetchMembersSaga);
}

export function* openTeamVaultSaga({ payload: { teamId } }) {
  try {
    yield call(initTeam, teamId);
    const listsById = yield select(listsTeamSelector, { teamId });
    const lists = objectToArray(listsById);
    const defaultList = lists.find(list => list.type === LIST_TYPE.DEFAULT);
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

    // TODO: Here is opportunity to improve the calls
    yield fork(processTeamItemsSaga, {
      payload: {
        teamId,
      },
    });

    yield fork(processSharedItemsSaga, {
      payload: {
        teamId,
      },
    });

    yield put(finishIsLoading());
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
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
        : keyPair.password;

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
        teamKeys.length > 0 ? put(addTeamKeyPairBatch(teamKeys)) : null,
        shareKeys.length > 0 ? put(addShareKeyPairBatch(shareKeys)) : null,
      ]);

      if (!teamKeys?.length) {
        // Empty the personal vault or without system items, passtrought call of initTeams();
        yield call(initTeams);
      }
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
  yield takeLatest(SET_WORK_IN_PROGRESS_ITEM, setWorkInProgressItemSaga);
  yield takeLatest(ADD_LISTS_BATCH, initListsAndProgressEntities);
  yield takeLatest(UPDATE_WORK_IN_PROGRESS_ITEM, updateWorkInProgressItemSaga);
  yield takeLatest(SET_CURRENT_TEAM_ID, openTeamVaultSaga);
  yield takeLatest(ADD_TEAM_KEY_PAIR_BATCH, initTeams);
}
