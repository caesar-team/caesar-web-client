import { schema } from 'normalizr';
import { PERMISSION_ENTITY, TEAM_TYPE } from '@caesar/common/constants';
import { createPermissionsFromLinks } from '@caesar/common/utils/createPermissionsFromLinks';
import invitedUserSchema from './invitedUser';

const itemSchema = new schema.Entity(
  'itemsById',
  {
    invited: [invitedUserSchema],
  },
  {
    processStrategy: entity => ({
      ...entity,
      membersKeys:
        entity.invited?.reduce(
          (accumulator, item) => ({
            ...accumulator,
            [item.userId]: item.id,
          }),
          {},
        ) || {},
      _permissions: {
        ...createPermissionsFromLinks(entity._links),
        __typename:
          (entity.teamId || TEAM_TYPE.PERSONAL) === TEAM_TYPE.PERSONAL
            ? PERMISSION_ENTITY.ITEM
            : PERMISSION_ENTITY.TEAM_ITEM,
      },
      teamId: entity.teamId || TEAM_TYPE.PERSONAL, // If item is personal, it does not have enough time to normalize list data. Need to set 'personal' teamId explicitly
    }),
  },
);

export default itemSchema;
