import {
  put,
  call,
  fork,
  take,
  takeLatest,
  select,
  all,
} from 'redux-saga/effects';
import {
  INIT_WORKFLOW,
  INIT_USERS_SETTINGS,
  INIT_TEAMS_SETTINGS,
  INIT_TEAM_SETTINGS,
  INIT_IMPORT_SETTINGS,
  UPDATE_WORK_IN_PROGRESS_ITEM,
  SET_WORK_IN_PROGRESS_ITEM,
  finishIsLoading,
  setWorkInProgressListId,
  setWorkInProgressItem,
  decryption,
  INIT_TEAMS,
  vaultsReady,
  OPEN_CURRENT_VAULT,
  VAULTS_ARE_READY,
  INIT_DASHBOARD,
  finishProcessingKeyPairs,
  FINISH_PROCESSING_KEYPAIRS,
  INIT_CREATE_PAGE,
} from '@caesar/common/actions/workflow';
import { addListsBatch } from '@caesar/common/actions/entities/list';
import deepequal from 'fast-deep-equal';
import {
  addItemsBatch,
  ADD_ITEMS_BATCH,
  removeItemsBatch,
} from '@caesar/common/actions/entities/item';
import { updateGlobalNotification } from '@caesar/common/actions/application';
import {
  SET_CURRENT_TEAM_ID,
  setCurrentTeamId,
} from '@caesar/common/actions/user';
import {
  addShareKeyPairBatch,
  addTeamKeyPairBatch,
} from '@caesar/common/actions/keystore';
import {
  fetchUserSelfSaga,
  fetchUserTeamsSaga,
} from '@caesar/common/sagas/user';
import { fetchMembersSaga } from '@caesar/common/sagas/entities/member';
import {
  createTeamKeyPairSaga,
  fetchTeamsSaga,
} from '@caesar/common/sagas/entities/team';
import {
  convertNodesToEntities,
  convertItemsToEntities,
  convertTeamsToEntity,
  convertListsToEntities,
  convertKeyPairToEntity,
  convertShareItemsToEntities,
} from '@caesar/common/normalizers/normalizers';
import { objectToArray } from '@caesar/common/utils/utils';
import { upperFirst } from '@caesar/common/utils/string';
import { getLists, getTeamLists, getUserItems } from '@caesar/common/api';
import { TEAM_TYPE, LIST_TYPE, ROLE_ADMIN } from '@caesar/common/constants';
import {
  teamListsSelector,
  favoritesListSelector,
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
  teamKeyPairSelector,
  shareKeyPairsSelector,
  shareItemKeyPairSelector,
} from '@caesar/common/selectors/keystore';
import { addTeamsBatch } from '@caesar/common/actions/entities/team';
import { getServerErrorMessage } from '@caesar/common/utils/error';
import {
  teamListSelector,
  teamSelector,
} from '@caesar/common/selectors/entities/team';
import { ADD_KEYPAIRS_BATCH } from '../actions/entities/keypair';
import { memberSelector } from '../selectors/entities/member';

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
    let teamKeyPairs = yield select(teamKeyPairSelector, { teamId });

    if (!teamKeyPairs) {
      const team = yield select(teamSelector, { teamId });
      const { id: ownerId } = yield select(userDataSelector);
      const { publicKey } = yield select(memberSelector, { memberId: ownerId });

      // eslint-disable-next-line no-console
      console.warn(
        `The key pair for the team ${team?.title}: ${teamId} not found. Need to create a new one...`,
      );

      if (!publicKey) {
        throw new Error(
          `Can't creat the team:  ${team?.title ||
            teamId} cause the publickey is null`,
        );
      }

      yield call(createTeamKeyPairSaga, {
        payload: { team, publicKey },
      });

      teamKeyPairs = yield select(teamKeyPairSelector, { teamId });

      if (!teamKeyPairs) return;
    }

    const { privateKey = null, password = null } = teamKeyPairs;

    const teamItems = yield select(nonDecryptedTeamItemsSelector, { teamId });
    if (teamItems.length <= 0 || !privateKey || !password) return;

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

function* initTeam(teamId) {
  try {
    const currentTeamId = teamId;

    if (!currentTeamId || currentTeamId === TEAM_TYPE.PERSONAL) return;

    const { data: lists } = yield call(getTeamLists, currentTeamId);
    const { listsById } = convertNodesToEntities(lists);

    yield put(addListsBatch(listsById));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
  }
}

export function* openCurrentVaultSaga() {
  yield take(VAULTS_ARE_READY);
  const currentTeamId = yield select(currentTeamIdSelector);
  yield put(setCurrentTeamId(currentTeamId || TEAM_TYPE.PERSONAL));
}

function* initTeamsSaga() {
  try {
    // Load avaible teams
    // const { data: teams } = yield call(getUserTeams);
    const teams = yield select(teamListSelector);
    // yield all(teams.map(({ id }) => fork(initTeam, id, false)));

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
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
  }
}

export function* processKeyPairsSaga({ payload: { itemsById } }) {
  try {
    if (!itemsById) return;
    const keyPairs = objectToArray(itemsById);
    if (keyPairs.length > 0) {
      const teamKeys = [];
      const shareKeys = [];
      keyPairs.forEach(keyPair => {
        if (!keyPair?.data) return null;

        return keyPair.relatedItemId === null && keyPair.teamId !== null
          ? teamKeys.push(keyPair)
          : shareKeys.push(keyPair);
      });

      const putSagas = [];
      if (teamKeys.length > 0) {
        const teamKeyPairsById = convertKeyPairToEntity(teamKeys, 'teamId');
        putSagas.push(put(addTeamKeyPairBatch(teamKeyPairsById)));
      }

      if (shareKeys.length > 0) {
        const shareKeysById = convertKeyPairToEntity(
          shareKeys,
          'relatedItemId',
        );
        putSagas.push(put(addShareKeyPairBatch(shareKeysById)));
      }

      yield all(putSagas);
      yield put(finishProcessingKeyPairs());
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}
// If the teamId and  the relatedItemId are presented then the key belong the share item in the team
const keyPairsEncryptedByUserKeysFilter = keypair =>
  keypair.teamId === TEAM_TYPE.PERSONAL || !keypair.relatedItemId;
const keyPairsEncryptedByTeamKeysFilter = keypair =>
  keypair.teamId !== TEAM_TYPE.PERSONAL && keypair.relatedItemId;
function* loadKeyPairsAndPersonalItems() {
  try {
    // Init personal keys
    const keyPair = yield select(teamKeyPairSelector, {
      teamId: TEAM_TYPE.PERSONAL,
    });

    // Load lists
    const { data: lists } = yield call(getLists);
    const { listsById } = convertListsToEntities(lists);
    const defaultShareList = Object.values(listsById).find(
      list => list.type === LIST_TYPE.INBOX,
    );
    const { id: currentUserId } = yield select(userDataSelector);

    const {
      data: {
        keypairs = [],
        systems = [],
        personals = [],
        shares = [],
        teams = [],
      },
    } = yield call(getUserItems);

    // Merge all user items in the one array
    const { itemsById: systemItemsById = {} } = convertItemsToEntities(systems);
    const { itemsById } = convertItemsToEntities(personals);
    const { itemsById: sharedItemsById = {} } = convertShareItemsToEntities({
      items: shares,
      currentUserId,
      listId: defaultShareList?.id,
    });
    const { itemsById: teamsItemsById = {} } = convertItemsToEntities(teams);
    const { itemsById: keypairsById = {} } = convertItemsToEntities(keypairs);

    const keypairsArray = objectToArray(keypairsById);
    const systemItems = objectToArray(systemItemsById);
    const userItems = objectToArray(itemsById);
    const itemsEncryptedByUserKeys = [
      ...keypairsArray.filter(keyPairsEncryptedByUserKeysFilter),
      ...systemItems,
      ...userItems,
    ];
    const itemsEncryptedByTeamKeys = keypairsArray.filter(
      keyPairsEncryptedByTeamKeysFilter,
    );

    // decrypt the items
    if (itemsEncryptedByUserKeys?.length > 0) {
      yield put(
        decryption({
          items: itemsEncryptedByUserKeys,
          key: keyPair.privateKey,
          masterPassword: keyPair.password,
        }),
      );
    }

    // Inject shares into the defualt list
    // TODO: Remove that code in the future!
    if (defaultShareList?.id) {
      const notMineSharedItemsIds = Object.values(sharedItemsById)
        .filter(i => i.ownerId !== currentUserId)
        .map(i => i.id);

      listsById[defaultShareList.id].children = [
        ...listsById[defaultShareList.id].children,
        ...notMineSharedItemsIds,
      ];
    }

    yield put(addListsBatch(listsById));
    // Put to the store the shared and the team items, wait for processing of keypairs
    yield put(
      addItemsBatch({
        ...sharedItemsById,
        ...teamsItemsById,
        ...itemsEncryptedByTeamKeys,
      }),
    );

    if (!keypairsArray?.length) {
      yield put(finishProcessingKeyPairs());
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
  const lists = yield select(teamListsSelector, {
    teamId: currentTeamId,
  });
  const workInProgressList = workInProgressListId
    ? lists.find(list => list.id === workInProgressListId)
    : null;
  const favoritesList = yield select(favoritesListSelector);
  const defaultList = lists.find(list => list.type === LIST_TYPE.DEFAULT);
  const inboxList = lists.find(list => list.type === LIST_TYPE.INBOX);
  if (!workInProgressList) {
    if (favoritesList?.children?.length > 0) {
      yield put(setWorkInProgressListId(favoritesList.id));
    } else if (inboxList?.children?.length > 0) {
      yield put(setWorkInProgressListId(inboxList.id));
    } else {
      yield put(setWorkInProgressListId(defaultList.id));
    }
  }
  const workInProgressItem = yield select(workInProgressItemSelector);
  const itemFromStore = yield select(itemSelector, {
    itemId: workInProgressItem?.id,
  });
  const isItemExists = !!itemFromStore;

  if (
    !isItemExists ||
    ![currentTeamId, null].includes(workInProgressItem?.teamId)
  ) {
    yield put(setWorkInProgressItem(null));
  }
}

export function* initWorkflowSaga() {
  yield call(fetchUserSelfSaga);
  yield fork(initTeamsSaga);
  yield fork(fetchMembersSaga);
  yield call(loadKeyPairsAndPersonalItems);
}

export function* openTeamVaultSaga({ payload: { teamId } }) {
  try {
    //const team = yield select(teamSelector, { teamId });
    //console.log(team);
    const team = TEAM_TYPE.PERSONAL;
    if (!team && teamId !== TEAM_TYPE.PERSONAL) {
      yield put(setCurrentTeamId(TEAM_TYPE.PERSONAL));

      return;
    }

    if (!team) {
      throw new Error('Houston, we have a problem!');
    }

    yield call(initTeam, teamId);
    yield call(initListsAndProgressEntities);
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
      return yield select(teamKeyPairSelector, { teamId: TEAM_TYPE.PERSONAL });
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

function* initDashboardSaga() {
  try {
    yield call(fetchUserTeamsSaga);
    yield call(initWorkflowSaga);
    yield call(openCurrentVaultSaga);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error: ', error);
  }
}

function* initCreatePageSaga() {
  try {
    yield call(initWorkflowSaga);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error: ', error);
  }
}

function* initUsersSettingsSaga() {
  try {
    yield call(initWorkflowSaga);
    yield put(finishIsLoading());
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error: ', error);
  }
}

function* initTeamsSettingsSaga() {
  try {
    yield call(initWorkflowSaga);
    yield call(fetchTeamsSaga);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error: ', error);
  }
}

function* initTeamSettingsSaga() {
  try {
    yield call(initWorkflowSaga);
    yield call(fetchTeamsSaga);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error: ', error);
  }
}

function* initImportSettingsSaga() {
  try {
    yield call(initWorkflowSaga);
    yield put(finishIsLoading());
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error: ', error);
  }
}

function* vaultsReadySaga() {
  yield put(vaultsReady());
}

function* checkUpdatesForWIP({ payload: { itemsById } }) {
  const oldItem = yield select(workInProgressItemSelector);
  if (oldItem?.id) {
    const newItem = itemsById[(oldItem?.id)];
    const isData = !!newItem?.data && !!oldItem?.data;
    const isChanged = !deepequal(newItem, oldItem);
    if (isData && isChanged) {
      yield put(setWorkInProgressItem(newItem));
    }
  }
}

export default function* workflowSagas() {
  // Init (get all items, keys, etc)
  yield takeLatest(INIT_WORKFLOW, initWorkflowSaga);
  yield takeLatest(INIT_DASHBOARD, initDashboardSaga);
  yield takeLatest(INIT_CREATE_PAGE, initCreatePageSaga);
  yield takeLatest(INIT_TEAMS, initTeamsSaga);
  yield takeLatest(INIT_USERS_SETTINGS, initUsersSettingsSaga);
  yield takeLatest(INIT_TEAMS_SETTINGS, initTeamsSettingsSaga);
  yield takeLatest(INIT_TEAM_SETTINGS, initTeamSettingsSaga);
  yield takeLatest(INIT_IMPORT_SETTINGS, initImportSettingsSaga);

  yield takeLatest(SET_WORK_IN_PROGRESS_ITEM, setWorkInProgressItemSaga);
  yield takeLatest(UPDATE_WORK_IN_PROGRESS_ITEM, updateWorkInProgressItemSaga);
  yield takeLatest(SET_CURRENT_TEAM_ID, openTeamVaultSaga);
  yield takeLatest(FINISH_PROCESSING_KEYPAIRS, vaultsReadySaga);
  // Wait for keypairs
  yield takeLatest(ADD_KEYPAIRS_BATCH, processKeyPairsSaga);
  yield takeLatest(OPEN_CURRENT_VAULT, openCurrentVaultSaga);
  yield takeLatest(ADD_ITEMS_BATCH, checkUpdatesForWIP);
}
