/* eslint-disable camelcase */
import { schema } from 'normalizr';
import { PERMISSION_ENTITY, TEAM_TYPE } from '@caesar/common/constants';
import { createPermissionsFromLinks } from '@caesar/common/utils/createPermissionsFromLinks';

const listSchema = new schema.Entity(
  'listsById',
  {},
  {
    processStrategy: entity => {
      // TODO: Remove destructurization when backend remove children props from list entity
      const { children, ...entityRest } = entity;

      return {
        ...entityRest,
        teamId: entity.teamId || TEAM_TYPE.PERSONAL,
        _permissions: {
          ...createPermissionsFromLinks(entity._links),
          __typename:
            (entity.teamId || TEAM_TYPE.PERSONAL) === TEAM_TYPE.PERSONAL
              ? PERMISSION_ENTITY.LIST
              : PERMISSION_ENTITY.TEAM_LIST,
        },
      };
    },
  },
);

export default listSchema;
