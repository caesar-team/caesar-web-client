import { createSelector } from 'reselect';
import { currentTeamSelector } from '@caesar/common/selectors/currentUser';
import { generateSystemItemName } from '@caesar/common/utils/item';
import { ENTITY_TYPE, REGEXP_TESTER } from '@caesar/common/constants';
import { objectToArray } from '../../utils/utils';

export const entitiesSelector = state => state.entities;

export const systemItemsEntitySelector = createSelector(
  entitiesSelector,
  entities => entities.system,
);

const itemIdPropSelector = (_, props) => props.id;
export const systemItemSelector = createSelector(
  systemItemsEntitySelector,
  itemIdPropSelector,
  (systemItems, itemId) =>
    Object.values(systemItems).find(({ data }) =>
      [
        generateSystemItemName(ENTITY_TYPE.SHARE, itemId),
        generateSystemItemName(ENTITY_TYPE.TEAM, itemId),
      ].includes(data?.name),
    ) || null,
);

export const systemItemsSelector = createSelector(
  systemItemsEntitySelector,
  systemItemsEntity => systemItemsEntity.byId || {},
);

const itemIdsPropSelector = (_, props) => props.itemIds;

export const systemItemsBatchSelector = createSelector(
  systemItemsSelector,
  itemIdsPropSelector,
  (systemItems, itemIds) =>
    itemIds.map(itemId => {
      return (
        Object.values(systemItems).find(({ data }) =>
          [
            generateSystemItemName(ENTITY_TYPE.SHARE, itemId),
            generateSystemItemName(ENTITY_TYPE.TEAM, itemId),
          ].includes(data?.name),
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

export const teamSystemItemsSelector = createSelector(
  systemItemsSelector,
  items =>
    objectToArray(items).filter(({ data }) =>
      REGEXP_TESTER.SYSTEM.IS_TEAM(data.name),
    ) || {},
);
