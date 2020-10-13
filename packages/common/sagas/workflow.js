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
  INIT_SETTINGS,
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
} from '@caesar/common/actions/workflow';
import { addListsBatch } from '@caesar/common/actions/entities/list';
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
  addShareKeyPairBatch,
  addTeamKeyPairBatch,
} from '@caesar/common/actions/keystore';
import { fetchMembersSaga } from '@caesar/common/sagas/entities/member';
import { createTeamKeyPairSaga } from '@caesar/common/sagas/entities/team';
import {
  convertNodesToEntities,
  convertItemsToEntities,
  convertTeamsToEntity,
  convertListsToEntities,
  convertKeyPairToEntity,
} from '@caesar/common/normalizers/normalizers';
import { objectToArray } from '@caesar/common/utils/utils';
import { upperFirst } from '@caesar/common/utils/string';
import { getLists, getTeamLists, getUserItems } from '@caesar/common/api';
import { TEAM_TYPE, LIST_TYPE, ROLE_ADMIN } from '@caesar/common/constants';
import { teamListsSelector } from '@caesar/common/selectors/entities/list';
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

function* initTeams() {
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
        if (!keyPair.data?.name) return null;

        return keyPair.teamId !== null
          ? teamKeys.push(keyPair)
          : shareKeys.push(keyPair);
      });

      const putSagas = [];
      if (teamKeys.length > 0) {
        const teamKeyPairsById = convertKeyPairToEntity(teamKeys);
        putSagas.push(put(addTeamKeyPairBatch(teamKeyPairsById)));
      }

      if (shareKeys.length > 0) {
        const shareKeysById = convertKeyPairToEntity(shareKeys);
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

function* loadKeyPairsAndPersonalItems() {
  try {
    // Init personal keys
    const keyPair = yield select(teamKeyPairSelector, {
      teamId: TEAM_TYPE.PERSONAL,
    });

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
    const { itemsById: sharedItemsById = {} } = convertItemsToEntities(shares);
    const { itemsById: teamsItemsById = {} } = convertItemsToEntities(teams);
    const { itemsById: keypairsById = {} } = convertItemsToEntities(keypairs);

    const keypairsArray = objectToArray(keypairsById);
    const systemItems = objectToArray(systemItemsById);
    const userItems = objectToArray(itemsById);
    const itemsEncryptedByUserKeys = [
      ...keypairsArray,
      ...systemItems,
      ...userItems,
    ];

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

    // Put to the store the shared and the team items, wait for processing of keypairs
    yield put(addItemsBatch({ ...sharedItemsById, ...teamsItemsById }));

    // Load lists
    const { data: lists } = yield call(getLists);
    const { listsById } = convertListsToEntities(lists);

    yield put(addListsBatch(listsById));

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
  const workInProgressList = !workInProgressListId
    ? lists.find(list => list.id === workInProgressListId)
    : null;
  const favoritesList = lists.find(list => list.type === LIST_TYPE.FAVORITES);
  const defaultList = lists.find(list => list.type === LIST_TYPE.DEFAULT);

  if (!workInProgressList) {
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
  // Wait for the user data
  yield take(FETCH_USER_SELF_SUCCESS);
  yield fork(initTeams);
  yield fork(fetchMembersSaga);
  yield call(loadKeyPairsAndPersonalItems);
}

export function* openTeamVaultSaga({ payload: { teamId } }) {
  try {
    const team = yield select(teamSelector, { teamId });
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

function* initSettings() {
  try {
    yield call(initWorkflow);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error: ', error);
  }
}

function* initDashboardSaga() {
  try {
    yield call(initWorkflow);
    yield call(openCurrentVaultSaga);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('error: ', error);
  }
}

function* vaultsReadySaga() {
  yield put(vaultsReady());
}

export default function* workflowSagas() {
  // Init (get all items, keys, etc)
  yield takeLatest(INIT_WORKFLOW, initWorkflow);
  yield takeLatest(INIT_TEAMS, initTeams);
  yield takeLatest(INIT_SETTINGS, initSettings);
  yield takeLatest(SET_WORK_IN_PROGRESS_ITEM, setWorkInProgressItemSaga);
  yield takeLatest(UPDATE_WORK_IN_PROGRESS_ITEM, updateWorkInProgressItemSaga);
  yield takeLatest(SET_CURRENT_TEAM_ID, openTeamVaultSaga);
  yield takeLatest(FINISH_PROCESSING_KEYPAIRS, vaultsReadySaga);
  // Wait for keypairs
  yield takeLatest(ADD_KEYPAIRS_BATCH, processKeyPairsSaga);
  yield takeLatest(OPEN_CURRENT_VAULT, openCurrentVaultSaga);
  yield takeLatest(INIT_DASHBOARD, initDashboardSaga);
}
