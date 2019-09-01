import { createSelector } from 'reselect';
import { DEFAULT_TEAM_TYPE } from 'common/constants';

export const entitiesSelector = state => state.entities;

export const teamEntitySelector = createSelector(
  entitiesSelector,
  entities => entities.team,
);

export const isLoadingSelector = createSelector(
  teamEntitySelector,
  teamEntity => teamEntity.isLoading,
);

export const teamsByIdSelector = createSelector(
  teamEntitySelector,
  teamEntity => teamEntity.byId,
);

export const teamListSelector = createSelector(
  teamsByIdSelector,
  byId => Object.values(byId) || [],
);

export const defaultTeamSelector = createSelector(
  teamListSelector,
  teamList => teamList.find(team => team.type === DEFAULT_TEAM_TYPE),
);
