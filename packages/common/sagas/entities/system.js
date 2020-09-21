import { call, select, put } from '@redux-saga/core/effects';
import { userDefaultListIdSelector } from '../../selectors/user';
import { teamKeyPairSelector } from '../../selectors/keystore';
import { TEAM_TYPE } from '../../constants';
import { generateSystemItem, saveItemSaga } from './item';
import { addSystemItemsBatch } from '../../actions/entities/system';

export function* createSystemItemKeyPair({ payload: { item, type } }) {
  const defaultListId = yield select(userDefaultListIdSelector);
  const { publicKey } = yield select(teamKeyPairSelector, {
    teamId: TEAM_TYPE.PERSONAL,
  });

  if (!type) {
    throw new Error(`The type of system item isn't defined`);
  }

  let systemKeyPairItem = yield call(
    generateSystemItem,
    type,
    defaultListId,
    item.id,
  );

  // Encrypt and save the system keypair item to the owner personal vault
  const systemItemFromServer = yield call(saveItemSaga, {
    item: { ...systemKeyPairItem, relatedItem: item.id },
    publicKey,
  });

  systemKeyPairItem = {
    ...systemKeyPairItem,
    ...systemItemFromServer,
  };

  yield put(
    addSystemItemsBatch({
      [systemKeyPairItem.id]: systemKeyPairItem,
    }),
  );
}
