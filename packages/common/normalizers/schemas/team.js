/* eslint-disable camelcase */
import { schema } from 'normalizr';
import { PERMISSION_ENTITY } from '@caesar/common/constants';
import { createPermissionsFromLinks } from '@caesar/common/utils/createPermissionsFromLinks';
import memberSchema from './member';

const teamSchema = new schema.Entity(
  'teamsById',
  {
    members: [memberSchema],
  },
  {
    processStrategy: entity => ({
      ...entity,
      _permissions: {
        ...createPermissionsFromLinks(entity._links),
        __typename: PERMISSION_ENTITY.TEAM,
      },
      locked: false,
    }),
  },
);

export default teamSchema;
