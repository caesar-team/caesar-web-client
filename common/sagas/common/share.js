import { call, select, all } from '@redux-saga/core/effects';
import { getOrCreateMemberBatchSaga } from 'common/sagas/entities/member';
import { itemChildItemsSelector } from 'common/selectors/entities/item';
import { keyPairSelector, masterPasswordSelector } from 'common/selectors/user';
import { decryptItem, getPrivateKeyObj } from 'common/utils/cipherUtils';
import { ROLE_USER } from 'common/constants';

export function* prepareUsersForSharing(members) {
  const emailRolePairs = members.map(({ email }) => ({
    email,
    role: ROLE_USER,
  }));

  return yield call(getOrCreateMemberBatchSaga, {
    payload: { emailRolePairs },
  });
}

function* clarifyItemMembers(item, members = []) {
  const childItems = yield select(itemChildItemsSelector, { itemId: item.id });

  return members.filter(
    ({ id, teamId }) =>
      !childItems.some(
        childItem => childItem.userId === id && childItem.teamId === teamId,
      ),
  );
}

function* getItemUserPairCombinations(item, members = [], privateKeyObj) {
  const cleanedMembers = yield call(clarifyItemMembers, item, members);

  const { id, data } = item;

  let itemData = data;

  if (!itemData) {
    itemData = yield call(decryptItem, item.secret, privateKeyObj);
  }

  return cleanedMembers.map(({ id: memberId, email, publicKey, teamId }) => ({
    item: { id, data: itemData },
    user: { id: memberId, email, publicKey, teamId },
  }));
}

export function* getItemUserPairs({ items, members }) {
  const keyPair = yield select(keyPairSelector);
  const masterPassword = yield select(masterPasswordSelector);

  const privateKeyObj = yield call(
    getPrivateKeyObj,
    keyPair.privateKey,
    masterPassword,
  );

  const itemUserPairs = yield all(
    items.map(item =>
      call(getItemUserPairCombinations, item, members, privateKeyObj),
    ),
  );

  return itemUserPairs.flat();
}
