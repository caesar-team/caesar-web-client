import { put, call, fork, takeLatest, select, all } from 'redux-saga/effects';
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
  setPersonalDefaultListId,
} from '@caesar/common/actions/user';
import { addTeamKeyPair, addShareKeyPair } from '@caesar/common/actions/keyStore';
import { fetchMembersSaga } from '@caesar/common/sagas/entities/member';
import {
  convertNodesToEntities,
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
import { ENTITY_TYPE, ITEM_TYPE, TEAM_TYPE } from '@caesar/common/constants';
import {
  favoriteListSelector,
  trashListSelector,
  currentTeamTrashListSelector,
  defaultListSelector,
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
  sharesKeyPairSelector,
} from '@caesar/common/selectors/keyStore';
import { getFavoritesList } from '@caesar/common/normalizers/utils';
import { fetchTeamSuccess } from '@caesar/common/actions/entities/team';
import { getServerErrorMessage } from '@caesar/common/utils/error';
import { generateSystemItem } from '@caesar/common/sagas/entities/item';
import { extractKeysFromSystemItem } from '@caesar/common/utils/item';
import { teamAdminUsersSelector } from '@caesar/common/selectors/entities/team';

function* initKeyStore() {
  try {
    const keyPair = yield select(personalKeyPairSelector);
    const masterPassword = yield select(masterPasswordSelector);

    const { data: userItems } = yield call(getUserItems);
    const systemItems = [
      ...userItems.teams,
      { items: userItems.personal },
    ].reduce(
      (acc, { items }) => [
        ...acc,
        ...items.filter(item => item.type === ITEM_TYPE.SYSTEM),
      ],
      [],
    );

    if (systemItems?.length > 0) {
      yield put(
        decryption({
          items: systemItems,
          key: keyPair.privateKey,
          masterPassword,
        }),
      );
    }
  } catch (error) {
    console.log(error);
    yield put(
      updateGlobalNotification(getServerErrorMessage(error), false, true),
    );
  }
}

function* initPersonal(withDecryption) {
  try {
    const currentTeamId = yield select(currentTeamIdSelector);

    if (currentTeamId !== TEAM_TYPE.PERSONAL) {
      return;
    }

    const { data: rawLists } = yield call(getLists);
    const lists = extractRelatedAndNonSystemItems(rawLists);
    const { listsById, itemsById } = convertNodesToEntities(
      lists,
    );

    if (withDecryption) {
      const currentUserId = yield select(userIdSelector);
      const keyPair = yield select(personalKeyPairSelector);
      const masterPassword = yield select(masterPasswordSelector);
      const items = sortItemsByFavorites(objectToArray(itemsById));
      const ownItems = [];
      const notOwnItems = [];

      items.forEach(item => {
        if (item.ownerId === currentUserId) {
          ownItems.push(item);
        } else {
          notOwnItems.push(item);
        }
      });

      if (ownItems?.length > 0) {
        yield put(
          decryption({
            items: ownItems,
            key: keyPair.privateKey,
            masterPassword,
          }),
        );
      }

      if (notOwnItems?.length > 0) {
        const keyPairs = yield select(sharesKeyPairSelector, {
          shareIds: notOwnItems.map(({ id }) => id),
        });

        yield all(
          keyPairs.map((pair, index) =>
            put(
              decryption({
                items: [notOwnItems[index]],
                key: pair.privateKey,
                masterPassword: pair.pass,
              }),
            ),
          ),
        );
      }
    }

    const defaultList = yield select(defaultListSelector);
    const trashList = yield select(trashListSelector);
    let favoritesList = yield select(favoriteListSelector);

    if (!favoritesList?.id) {
      favoritesList = getFavoritesList(itemsById, trashList?.id);
    }

    yield put(setPersonalDefaultListId(defaultList.id));
    yield put(
      addListsBatch({
        ...listsById,
        [favoritesList.id]: favoritesList,
      }),
    );

    const workInProgressListId = yield select(workInProgressListIdSelector);

    if (
      !workInProgressListId ||
      ![currentTeamId, null].includes(listsById[workInProgressListId]?.teamId)
    ) {
      yield put(setWorkInProgressListId(favoritesList.id));
    }

    const workInProgressItem = yield select(workInProgressItemSelector);

    if (
      !workInProgressItem ||
      ![currentTeamId, null].includes(workInProgressItem?.teamId)
    ) {
      yield put(setWorkInProgressItem(null));
    }

    yield put(resetWorkInProgressItemIds(null));

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
    const { listsById, itemsById } = convertNodesToEntities(
      lists,
    );

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
  yield call(initKeyStore);
  const currentTeamId = yield select(currentTeamIdSelector);

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

export function* setCurrentTeamIdWatchSaga({
  payload: { withDecryption = true },
}) {
  try {
    const currentTeamId = yield select(currentTeamIdSelector);

    if (!currentTeamId) return;

    if (currentTeamId === TEAM_TYPE.PERSONAL) {
      yield call(initPersonal, withDecryption);
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

export function* decryptionEndWatchSaga() {
  try {
    const systemItems = yield select(systemItemsSelector);
    const systemItemsArray = objectToArray(systemItems);

    if (systemItemsArray.length > 0) {
      yield all(systemItemsArray.map(
        item => item.data?.name?.includes(ENTITY_TYPE.TEAM)
          ? put(addTeamKeyPair(item))
          : put(addShareKeyPair(item))),
      );
    }
  } catch (error) {
    console.log(error);
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
    console.log('error: ', error);
  }
}

export default function* workflowSagas() {
  yield takeLatest(INIT_WORKFLOW, initWorkflow);
  yield takeLatest(UPDATE_WORK_IN_PROGRESS_ITEM, updateWorkInProgressItemSaga);
  yield takeLatest(SET_CURRENT_TEAM_ID, setCurrentTeamIdWatchSaga);
  yield takeLatest(DECRYPTION_END, decryptionEndWatchSaga);
  yield takeLatest(SET_WORK_IN_PROGRESS_ITEM, setWorkInProgressItemSaga);
}
