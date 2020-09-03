import { createSelector } from 'reselect';
import { currentTeamSelector } from '@caesar/common/selectors/user';
import { generateSystemItemName } from '@caesar/common/utils/item';
import { ENTITY_TYPE } from '@caesar/common/constants';

export const entitiesSelector = state => state.entities;

export const systemItemsSelector = createSelector(
  entitiesSelector,
  entities => entities.system || {},
);

const itemIdsPropSelector = (_, props) => props.itemIds;

export const systemItemsBatchSelector = createSelector(
  systemItemsSelector,
  itemIdsPropSelector,
  (systemItems, itemIds) =>
    itemIds.map(itemId => {
      return (
        Object.values(systemItems).find(
          ({ data }) => [
            generateSystemItemName(ENTITY_TYPE.SHARE, itemId),
            generateSystemItemName(ENTITY_TYPE.TEAM, itemId),
          ].includes(data.name),
        ) || {}
      );
    }),
);

export const teamSystemItemSelector = createSelector(
  systemItemsSelector,
  currentTeamSelector,
  (items, currentTeam) =>
    items.find(
      ({ data }) =>
        data.name === generateSystemItemName(ENTITY_TYPE.TEAM, currentTeam.id),
    ) || {},
);