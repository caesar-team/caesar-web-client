import { createSelector } from 'reselect';
import { currentTeamSelector } from '@caesar/common/selectors/user';
import { generateSystemItemName } from '@caesar/common/utils/item';
import { ENTITY_TYPE, ITEM_TYPE } from '@caesar/common/constants';

export const entitiesSelector = state => state.entities;

export const systemItemsSelector = createSelector(
  entitiesSelector,
  entities => entities.system || [],
);

const itemIdsPropSelector = (_, props) => props.itemIds;

export const systemItemsBatchSelector = createSelector(
  systemItemsSelector,
  itemIdsPropSelector,
  (systemItems, itemIds) =>
    itemIds.map(itemId => {
      return (
        systemItems.find(
          ({ data }) =>
            data.name === generateSystemItemName(ENTITY_TYPE.ITEM, itemId),
        ) || {}
      );
    }),
);
