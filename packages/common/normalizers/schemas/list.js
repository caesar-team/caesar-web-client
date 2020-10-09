/* eslint-disable camelcase */
import { schema } from 'normalizr';
import { ENTITY_TYPE, TEAM_TYPE } from '@caesar/common/constants';
import { createPermissionsFromLinks } from '@caesar/common/utils/createPermissionsFromLinks';
import itemSchema from './item';

const listSchema = new schema.Entity(
  'listsById',
  {
    children: [itemSchema],
  },
  {
    processStrategy: entity => ({
      ...entity,
      __type: ENTITY_TYPE.LIST,
      teamId: entity.teamId || TEAM_TYPE.PERSONAL,
      _permissions: createPermissionsFromLinks(entity._links),
    }),
  },
);

export default listSchema;
