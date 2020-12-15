import Router from 'next/router';
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
  INIT_USERS_SETTINGS,
  INIT_TEAMS_SETTINGS,
  INIT_TEAM_SETTINGS,
  INIT_IMPORT_SETTINGS,
  UPDATE_WORK_IN_PROGRESS_ITEM,
  SET_WORK_IN_PROGRESS_ITEM,
  startIsLoading,
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
  INIT_PREFERENCES_SETTINGS,
  DOWNLOAD_ITEM_ATTACHMENT,
  DOWNLOAD_ITEM_ATTACHMENTS,
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
  setLastUpdatedUnixtime,
} from '@caesar/common/actions/currentUser';
import {
  addShareKeyPairBatch,
  addTeamKeyPairBatch,
} from '@caesar/common/actions/keystore';
import {
  fetchKeyPairSaga,
  fetchUserSelfSaga,
  checkIfUserWasKickedFromTeam,
} from '@caesar/common/sagas/currentUser';
import { fetchUsersSaga } from '@caesar/common/sagas/entities/user';
import {
  createTeamKeyPairSaga,
  fetchTeamsSaga,
} from '@caesar/common/sagas/entities/team';
import { fetchTeamMembersSaga } from '@caesar/common/sagas/entities/member';
import {
  convertItemsToEntities,
  convertListsToEntities,
  convertKeyPairToEntity,
  convertShareItemsToEntities,
} from '@caesar/common/normalizers/normalizers';
import { arrayToObject, objectToArray } from '@caesar/common/utils/utils';
import {
  getItemRaws,
  getKeypairs,
  getLastUpdatedUserItems,
  getLists,
  getRemovedItems,
  getTeamKeyPair,
  getTeamLists,
} from '@caesar/common/api';
import { TEAM_TYPE, LIST_TYPE } from '@caesar/common/constants';
import {
  teamListsSelector,
  favoritesListSelector,
} from '@caesar/common/selectors/entities/list';
import {
  currentUserDataSelector,
  currentTeamIdSelector,
  isUserDomainAdminOrManagerSelector,
  currentUserTeamListSelector,
  getLastUpdatedSelector,
} from '@caesar/common/selectors/currentUser';
import {
  itemsByIdSelector,
  itemsByListIdsSelector,
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
  isKeystoreEmpty,
} from '@caesar/common/selectors/keystore';
import { addTeamsBatch, lockTeam } from '@caesar/common/actions/entities/team';
import { getServerErrorMessage } from '@caesar/common/utils/error';
import {
  teamListSelector,
  teamSelector,
} from '@caesar/common/selectors/entities/team';
import { ADD_KEYPAIRS_BATCH } from '../actions/entities/keypair';
import { teamMembersFullViewSelector } from '../selectors/entities/member';
import { userSelector } from '../selectors/entities/user';
import { fetchTeamMembersRequest } from '../actions/entities/member';
import { getCurrentUnixtime } from '../utils/dateUtils';
import { decryptData, unsealPrivateKeyObj } from '../utils/cipherUtils';
import { downloadAsZip, downloadFile } from '../utils/file';
import { getItemMetaData } from '../utils/item';
import { getItemKeyPair } from './entities/item';

const ON_DEMAND_DECRYPTION = true;
// TODO: This saga is huge and must be refactored

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

function* getPersonalKey() {
  let keypair = yield select(teamKeyPairSelector, {
    teamId: TEAM_TYPE.PERSONAL,
  });

  if (!keypair) {
    // eslint-disable-next-line no-console
    // Check if the keystore was reset.
    keypair = yield call(fetchKeyPairSaga);
  }

  const { privateKey = null, password = null } = keypair;

  if (!privateKey || !password) return null;

  return {
    password,
    privateKey,
  };
}

export function* decryptUserItems(items) {
  let personalKey = yield call(getPersonalKey);

  if (!personalKey) {
    personalKey = yield call(getPersonalKey);
  }

  if (!personalKey) {
    // eslint-disable-next-line no-console
    console.error(
      "Warning! Can't decrypt user item! The keypair is missing or empty",
    );

    return;
  }
  // decrypt the items
  if (items?.length > 0) {
    yield put(
      decryption({
        items,
        key: personalKey.privateKey,
        masterPassword: personalKey.password,
      }),
    );
  }
}

export function* decryptItem(item) {
  if (!item || !('id' in item)) return;
  // decrypt the items
  if (!item.data) {
    const keyPair = yield call(getItemKeyPair, {
      payload: {
        item,
      },
    });

    yield put(
      decryption({
        items: [item],
        key: keyPair.privateKey,
        masterPassword: keyPair.password,
      }),
    );
  }
}

export function* decryptAttachmentRaw({ id, raw }, privateKeyObj) {
  return {
    id,
    raw: yield Promise.resolve(decryptData(raw, privateKeyObj)),
  };
}

export function* downloadItemAttachmentSaga({
  payload: { itemId, attachment = {} },
}) {
  if (!itemId) return;
  const item = yield select(itemSelector, { itemId });
  const keyPair = yield call(getItemKeyPair, {
    payload: {
      item,
    },
  });

  const { data: { raws } = { raws: [] } } = yield call(getItemRaws, itemId);
  const itemRaws = JSON.parse(raws);

  const { raw = null } = itemRaws[attachment.id] || {};

  if (raw) {
    const privateKeyObj = yield Promise.resolve(
      unsealPrivateKeyObj(keyPair.privateKey, keyPair.password),
    );
    const rawFile = yield Promise.resolve(decryptData(raw, privateKeyObj));
    const { name, ext } = attachment;
    downloadFile(rawFile, `${name}.${ext}`);
  }
}

export function* downloadItemAttachmentsSaga({ payload: { itemId } }) {
  if (!itemId) return;
  const item = yield select(itemSelector, { itemId });
  const { title: itemName } = getItemMetaData(item);
  const { attachments } = item.data;

  const keyPair = yield call(getItemKeyPair, {
    payload: {
      item,
    },
  });

  const { data: { raws } = { raws: [] } } = yield call(getItemRaws, itemId);
  const itemRaws = JSON.parse(raws);

  if (itemRaws) {
    const privateKeyObj = yield Promise.resolve(
      unsealPrivateKeyObj(keyPair.privateKey, keyPair.password),
    );
    const ids = Object.keys(itemRaws);
    const decryptedRawsArray = yield all(
      ids.map(id => decryptAttachmentRaw(itemRaws[id], privateKeyObj)),
    );
    const decryptedRaws = arrayToObject(decryptedRawsArray);

    const files = attachments.map(attachment => ({
      raw: decryptedRaws[attachment.id].raw,
      name: `${attachment.name}.${attachment.ext}`,
    }));
    const filename = `${itemName}_attachments`;
    downloadAsZip({ files, filename });
  }
}

function* isTeamKeypairExists(teamId) {
  return !!(yield select(teamKeyPairSelector, { teamId }));
}

export function* processSharedItemsSaga({ payload: { teamId } }) {
  try {
    const keyPairs = yield select(shareKeyPairsSelector);
    const sharedItems = yield select(nonDecryptedSharedItemsSelector, {
      teamId,
    });

    yield all(
      decryptItemsByItemIdKeys(
        sharedItems.filter(sharedItem => keyPairs[sharedItem.id]),
        keyPairs,
      ),
    );

    const removedItemsIds = sharedItems
      .filter(sharedItem => !keyPairs[sharedItem.id])
      .map(sharedItem => sharedItem.id);

    if (removedItemsIds.length) {
      // eslint-disable-next-line no-console
      console.warn(
        `WARNING! These items cannot be decrypted as there are no keypairs and will remove from the store, the ids: %s`,
        removedItemsIds,
      );

      // Remove undecrypttable items from the store
      yield put(removeItemsBatch(removedItemsIds));
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

function* syncRemovedItems() {
  const itemsById = yield select(itemsByIdSelector);

  const { data: removedItemsIds } = yield call(
    getRemovedItems,
    Object.keys(itemsById),
  );

  if (removedItemsIds.length) {
    // Remove undecrypttable items from the store
    yield put(removeItemsBatch(removedItemsIds));
  }
}

function* checkTeamPermissionsAndKeys(teamId, createKeyPair = false) {
  const teamKeypairExists = yield call(isTeamKeypairExists, teamId);

  if (!teamKeypairExists) {
    if (teamId === TEAM_TYPE.PERSONAL) {
      // eslint-disable-next-line no-console
      console.warn(`The key pair for the Personal team not found. `);

      return false;
    }

    // Update the members list
    yield put(fetchTeamMembersRequest({ teamId, withoutKeys: true }));
    const { id: ownerId } = yield select(currentUserDataSelector);
    const team = yield select(teamSelector, { teamId });
    const teamMembers = (yield select(teamMembersFullViewSelector, {
      teamId,
    })).filter(m => m.userId !== ownerId);

    if (teamMembers.length > 0) {
      // eslint-disable-next-line no-console
      console.warn(
        `The key pair for the team ${team?.title}: ${teamId} not found. 
        But the team has at least one member, the count of members is ${teamMembers?.length}. `,
      );

      return false;
    }

    let publicKey = null;

    const currentUser = yield select(userSelector, {
      userId: ownerId,
    });

    if (currentUser && 'publicKey' in currentUser) {
      publicKey = currentUser.publicKey;
    } else {
      // for some reason the user key didn't load
      const userKeypair = yield call(fetchKeyPairSaga);
      publicKey = userKeypair?.publicKey;
    }

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

    if (createKeyPair) {
      yield call(createTeamKeyPairSaga, {
        payload: { team, ownerId, publicKey },
      });
    }

    return !!(yield select(teamKeyPairSelector, { teamId }));
  }

  return !!(yield select(teamKeyPairSelector, { teamId }));
}

export function* processTeamItemsSaga({ payload: { teamId } }) {
  try {
    const teamKeyPairs = yield select(teamKeyPairSelector, { teamId });
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
function* loadTeamKeypairIfNotExists(teamId) {
  const teamKeypairExists = yield call(isTeamKeypairExists, teamId);

  if (!teamKeypairExists && teamId !== TEAM_TYPE.PERSONAL) {
    const { data: keypairItem } = yield call(getTeamKeyPair, teamId);
    const { itemsById } = convertItemsToEntities([keypairItem]);
    const items = Object.values(itemsById);
    yield call(decryptUserItems, items);
  }
}
function* initTeam(teamId) {
  try {
    const currentTeamId = teamId;

    if (!currentTeamId || currentTeamId === TEAM_TYPE.PERSONAL) return;
    const { data: lists } = yield call(getTeamLists, currentTeamId);
    const listsById = convertListsToEntities(lists);

    yield put(addListsBatch(listsById));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
  }
}

function* checkTeamKeyPair(team, createKeyPair = false) {
  const haveTeamPermissionsAndKeys = yield call(
    checkTeamPermissionsAndKeys,
    team.id,
    createKeyPair,
  );
  const needToLockTeam = !haveTeamPermissionsAndKeys;

  if (team.locked !== needToLockTeam) {
    return {
      ...team,
      locked: needToLockTeam,
    };
  }

  return null;
}

function* checkTeamsKeyPairs(createKeyPair = false) {
  const isUserDomainAdminOrManager = yield select(
    isUserDomainAdminOrManagerSelector,
  );
  const teams = yield select(
    isUserDomainAdminOrManager ? teamListSelector : currentUserTeamListSelector,
  );

  const checkCalls = teams
    .filter(t => t.id !== TEAM_TYPE.PERSONAL)
    .map(team => checkTeamKeyPair(team, createKeyPair));
  const checkedTeams = yield all(checkCalls);
  yield put(addTeamsBatch(arrayToObject(checkedTeams.filter(team => !!team))));
}

function* checkWIPItem() {
  const WIPItem = yield select(workInProgressItemSelector);
  if (!WIPItem) return;

  const itemInStore = yield select(itemSelector, { itemId: WIPItem.id });

  if (!deepequal(WIPItem.data, itemInStore.data)) {
    // The data is mismatced, update
    yield put(setWorkInProgressItem(itemInStore));
  }
}

function* initTeamsSaga() {
  try {
    // Load avaible teams
    yield call(fetchTeamsSaga);
    yield call(checkTeamsKeyPairs, true);
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
    // Load lists
    const { data: lists } = yield call(getLists);
    const listsById = convertListsToEntities(lists);
    const defaultShareList = Object.values(listsById).find(
      list => list.type === LIST_TYPE.INBOX,
    );

    const lastUpdated = yield select(getLastUpdatedSelector);
    const { id: currentUserId } = yield select(currentUserDataSelector);

    const {
      data: {
        keypairs = [],
        systems = [],
        personals = [],
        shares = [],
        teams = [],
      },
    } = yield call(getLastUpdatedUserItems, lastUpdated);

    yield put(setLastUpdatedUnixtime(getCurrentUnixtime()));

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
    const itemsEncryptedByUserKeys = [
      ...keypairsArray.filter(keyPairsEncryptedByUserKeysFilter),
      ...systemItems,
    ];
    const itemsEncryptedByTeamKeys = keypairsArray.filter(
      keyPairsEncryptedByTeamKeysFilter,
    );

    // decrypt the items
    if (itemsEncryptedByUserKeys?.length > 0) {
      yield call(decryptUserItems, itemsEncryptedByUserKeys);
    }

    yield put(addListsBatch(listsById));
    // Put to the store the shared and the team items, wait for processing of keypairs
    const storedItems = {
      ...itemsById,
      ...sharedItemsById,
      ...teamsItemsById,
      ...itemsEncryptedByTeamKeys,
    };

    if (Object.keys(storedItems).length > 0) {
      yield put(addItemsBatch(storedItems));
    }

    if (!keypairsArray?.length) {
      const isEmptyStore = yield select(isKeystoreEmpty);

      if (isEmptyStore) {
        const { data: serverKeypairs } = yield call(getKeypairs);
        const { itemsById: serverKeypairsById = {} } = convertItemsToEntities(
          serverKeypairs,
        );

        const serverKeypairsArray = objectToArray(serverKeypairsById);
        if (serverKeypairsArray && serverKeypairsArray.length !== 0) {
          yield call(decryptUserItems, serverKeypairsArray);
        } else {
          yield put(finishProcessingKeyPairs());
        }
      } else {
        yield put(finishProcessingKeyPairs());
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
  }
}

const itemsListFilter = listId => item => item.listId === listId;
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

  const listItems = yield select(itemsByListIdsSelector, {
    listIds: [favoritesList?.id, inboxList?.id, workInProgressList?.id],
  });
  const favoritesListCount =
    listItems.filter(itemsListFilter(favoritesList?.id))?.length || 0;
  const inboxListCount =
    listItems.filter(itemsListFilter(inboxList?.id))?.length || 0;
  const workInProgressListCount =
    listItems.filter(itemsListFilter(workInProgressList?.id))?.length || 0;

  let listIdToSet = workInProgressListId;
  if (!workInProgressList || workInProgressListCount <= 0) {
    if (favoritesListCount > 0) {
      listIdToSet = favoritesList.id;
    } else if (inboxListCount > 0) {
      listIdToSet = inboxList.id;
    } else {
      listIdToSet = defaultList.id;
    }

    yield put(setWorkInProgressListId(listIdToSet));
  }

  const workInProgressItem = yield select(workInProgressItemSelector);
  const itemFromStore = yield select(itemSelector, {
    itemId: workInProgressItem?.id,
  });
  const isItemExists = !!itemFromStore;

  if (
    !isItemExists ||
    currentTeamId !== workInProgressItem?.teamId ||
    workInProgressItem?.listId !== listIdToSet
  ) {
    yield put(setWorkInProgressItem(null));
  }
}

export function* initWorkflowSaga() {
  yield call(checkIfUserWasKickedFromTeam);
  yield call(loadKeyPairsAndPersonalItems);
  yield fork(fetchUsersSaga);
}

export function* openTeamVaultSaga({ payload: { teamId } }) {
  try {
    const currentUser = yield select(currentUserDataSelector);

    // If there is no currentUser we can't init even personal team
    if (!currentUser) return;

    const team = yield select(teamSelector, { teamId });
    if (!team && teamId !== TEAM_TYPE.PERSONAL) {
      yield put(setCurrentTeamId(TEAM_TYPE.PERSONAL));

      return;
    }

    if (!team) {
      throw new Error('Houston, we have a problem!');
    }

    const isTeamHasKeypair = yield call(isTeamKeypairExists, teamId);

    if (!isTeamHasKeypair) {
      yield call(loadTeamKeypairIfNotExists, teamId);
      // eslint-disable-next-line no-console
      console.warn(
        'Trying to load the team key from the server, the team: <b>%s</b>',
        team.title,
      );

      return;
    }

    yield call(initTeam, teamId);
    yield call(initListsAndProgressEntities);
    const checksResult = yield call(checkTeamPermissionsAndKeys, teamId);

    if (checksResult) {
      yield put(lockTeam(teamId, false));

      if (!ON_DEMAND_DECRYPTION) {
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
      }
    } else {
      yield put(
        updateGlobalNotification(
          `You do not have the keypair for the ${team?.title} team, please contact with your domain admin to provide access to the team.`,
          false,
          true,
        ),
      );
      yield put(lockTeam(teamId, true));
      // eslint-disable-next-line no-console
      console.error(`The team checks weren't pass`);
    }

    yield put(finishIsLoading());
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    yield call(checkIfUserWasKickedFromTeam);
  }
}

export function* openCurrentVaultSaga() {
  const teamId = yield select(currentTeamIdSelector) || TEAM_TYPE.PERSONAL;
  yield call(openTeamVaultSaga, { payload: { teamId } });
  yield call(syncRemovedItems);
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

function* decryptItemOnDemand({ payload: { item } }) {
  try {
    // If item is null or aready had decypted attachments then do not dectrypt again!
    if (!item || (item?.data?.raws && Object.values(item?.data?.raws) > 0)) {
      return;
    }

    yield fork(decryptItem, item, true);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error: ', error);
  }
}

function* setWorkInProgressItemSaga({ payload: { item } }) {
  try {
    if (!item) return;
    yield call(decryptItemOnDemand, {
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
    yield takeLatest(VAULTS_ARE_READY, openCurrentVaultSaga);
    yield call(initWorkflowSaga);
    yield call(checkTeamsKeyPairs);
    yield call(checkWIPItem);
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
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error: ', error);
  }
}

function* initTeamsSettingsSaga() {
  try {
    yield call(initWorkflowSaga);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error: ', error);
  }
}

function* initTeamSettingsSaga() {
  try {
    yield put(startIsLoading());

    const {
      router: {
        query: { id: teamId },
      },
    } = Router;

    yield call(initWorkflowSaga);
    yield call(fetchTeamMembersSaga, {
      payload: { teamId, withoutKeys: true },
    });
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

function* initPreferencesSettingsSaga() {
  try {
    yield call(fetchUserSelfSaga);
    yield put(finishIsLoading());
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error: ', error);
  }
}

function* vaultsReadySaga() {
  yield call(initTeamsSaga);
  yield put(vaultsReady());
}

function* checkUpdatesForWIP({ payload: { itemsById } }) {
  const oldItem = yield select(workInProgressItemSelector);
  if (oldItem?.id) {
    const newItem = itemsById[(oldItem?.id)];
    if (!newItem?.data || !oldItem?.data) {
      yield call(decryptItem, newItem, true);
    }

    const isChanged = !deepequal(newItem, oldItem);
    if (isChanged) {
      yield put(setWorkInProgressItem(newItem));
    }
  }
}

export function* resetDashboardWorkflow(teamId) {
  try {
    const currentTeamId = yield select(currentTeamIdSelector);

    if (currentTeamId === teamId) {
      yield put(setCurrentTeamId(TEAM_TYPE.PERSONAL));
      yield put(setWorkInProgressListId(null));
      yield put(setWorkInProgressItem(null));
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error', error);
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
  yield takeLatest(INIT_PREFERENCES_SETTINGS, initPreferencesSettingsSaga);

  yield takeLatest(SET_WORK_IN_PROGRESS_ITEM, setWorkInProgressItemSaga);
  yield takeLatest(UPDATE_WORK_IN_PROGRESS_ITEM, updateWorkInProgressItemSaga);
  yield takeLatest(OPEN_CURRENT_VAULT, openCurrentVaultSaga);
  yield takeLatest(SET_CURRENT_TEAM_ID, initDashboardSaga);
  yield takeLatest(ADD_KEYPAIRS_BATCH, processKeyPairsSaga);
  yield takeLatest(FINISH_PROCESSING_KEYPAIRS, vaultsReadySaga);
  yield takeLatest(DOWNLOAD_ITEM_ATTACHMENT, downloadItemAttachmentSaga);
  yield takeLatest(DOWNLOAD_ITEM_ATTACHMENTS, downloadItemAttachmentsSaga);
  // Wait for keypairs
  yield takeLatest(OPEN_CURRENT_VAULT, openCurrentVaultSaga);
  yield takeEvery(ADD_ITEMS_BATCH, checkUpdatesForWIP);
}
