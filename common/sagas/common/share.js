import { call, select } from '@redux-saga/core/effects';
import groupBy from 'lodash.groupby';
import { getOrCreateMemberBatchSaga } from 'common/sagas/entities/member';
import { teamsBatchSelector } from 'common/selectors/entities/team';
import { membersBatchSelector } from 'common/selectors/entities/member';
import { userDataSelector } from 'common/selectors/user';
import { itemsChildItemsBatchSelector } from 'common/selectors/entities/item';
import { ROLE_USER } from 'common/constants';

export function* prepareUsersForSharing({ payload: { members, teamIds } }) {
  const memberEmails = members.map(({ email }) => email);
  const emailRolePairs = memberEmails.map(email => ({
    email,
    role: ROLE_USER,
  }));
  const membersOfSharing = yield call(getOrCreateMemberBatchSaga, {
    payload: { emailRolePairs },
  });

  const newMembers = membersOfSharing.filter(({ isNew }) => isNew);

  const teams = yield select(teamsBatchSelector, { teamIds });
  const teamsMemberIds = teams.reduce(
    (accumulator, team) => [...accumulator, ...team.users.map(({ id }) => id)],
    [],
  );
  const teamsMembers = yield select(membersBatchSelector, {
    memberIds: teamsMemberIds,
  });

  const user = yield select(userDataSelector);
  const allMembers = [...membersOfSharing, ...teamsMembers].filter(
    ({ id }) => id !== user.id,
  );

  return {
    allMembers,
    newMembers,
  };
}

export function* resolveSharingConflicts({ payload: { items, members } }) {
  const childItemsBatch = yield select(itemsChildItemsBatchSelector, {
    itemIds: items.map(({ id }) => id),
  });
  const groupedChildItemsByItemId = groupBy(childItemsBatch, 'originalItemId');

  return items.reduce((outer, { id: itemId, data }) => {
    const itemChildItems = groupedChildItemsByItemId[itemId] || [];
    const alreadySharedMemberIds = itemChildItems
      ? itemChildItems.reduce((inner, { userId }) => [...inner, userId], [])
      : [];

    const newMembers = members.filter(
      ({ id }) => !alreadySharedMemberIds.includes(id),
    );

    return [
      ...outer,
      ...newMembers.map(({ id: memberId, email, publicKey }) => ({
        item: { id: itemId, data },
        user: { id: memberId, email, publicKey },
      })),
    ];
  }, []);
}
