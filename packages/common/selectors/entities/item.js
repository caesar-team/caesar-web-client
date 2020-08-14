import { createSelector } from 'reselect';
import { childItemsByIdSelector } from '@caesar/common/selectors/entities/childItem';
import { currentTeamSelector } from '@caesar/common/selectors/user';
import { generateSystemItemName } from '@caesar/common/utils/item';
import { ITEM_TYPE } from '@caesar/common/constants';

export const entitiesSelector = state => state.entities;

export const itemEntitySelector = createSelector(
  entitiesSelector,
  entities => entities.item,
);

export const itemsByIdSelector = createSelector(
  itemEntitySelector,
  itemEntity => itemEntity.byId,
);

export const itemListSelector = createSelector(
  itemsByIdSelector,
  byId => Object.values(byId) || [],
);

const itemIdPropSelector = (_, props) => props.itemId;

export const itemSelector = createSelector(
  itemsByIdSelector,
  itemIdPropSelector,
  (itemsById, itemId) => itemsById[itemId],
);

const itemIdsPropSelector = (_, props) => props.itemIds;

export const itemsBatchSelector = createSelector(
  itemsByIdSelector,
  itemIdsPropSelector,
  (itemsById, itemIds) => itemIds.map(itemId => itemsById[itemId]),
);

const teamIdPropSelector = (_, prop) => prop.teamId;

export const teamItemListSelector = createSelector(
  itemListSelector,
  teamIdPropSelector,
  (itemList, teamId) => itemList.filter(item => item.teamId === teamId),
);

export const itemChildItemsSelector = createSelector(
  itemSelector,
  childItemsByIdSelector,
  (item, childItemsById) =>
    item.invited.map(childItemId => childItemsById[childItemId]),
);

export const itemsChildItemsBatchSelector = createSelector(
  itemsByIdSelector,
  itemIdsPropSelector,
  childItemsByIdSelector,
  (itemsById, itemIds, childItemsById) => {
    return itemIds.reduce((accumulator, itemId) => {
      return [
        ...accumulator,
        ...itemsById[itemId].invited.map(
          childItemId => childItemsById[childItemId],
        ),
      ];
    }, []);
  },
);

export const systemItemsSelector = createSelector(
  itemsByIdSelector,
  items => Object.values(items).find(({ type }) => type === ITEM_TYPE.SYSTEM) || {},
);

export const teamSystemItemSelector = createSelector(
  systemItemsSelector,
  currentTeamSelector,
  (items, currentTeam) => items.find(({ name }) =>
    name === generateSystemItemName(currentTeam.id)) || {},
);
