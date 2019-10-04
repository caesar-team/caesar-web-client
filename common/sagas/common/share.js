import { call, select, all } from '@redux-saga/core/effects';
import { getOrCreateMemberBatchSaga } from 'common/sagas/entities/member';
import { itemChildItemsSelector } from 'common/selectors/entities/item';
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

function* getItemUserPairCombinations(item, members = []) {
  const cleanedMembers = yield call(clarifyItemMembers, item, members);

  const { id, data } = item;

  return cleanedMembers.map(({ id: memberId, email, publicKey, teamId }) => ({
    item: { id, data },
    user: { id: memberId, email, publicKey, teamId },
  }));
}

export function* getItemUserPairs({ items, members }) {
  const itemUserPairs = yield all(
    items.map(item => call(getItemUserPairCombinations, item, members)),
  );

  return itemUserPairs.flat();
}
