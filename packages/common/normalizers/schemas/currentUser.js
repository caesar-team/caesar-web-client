import { schema } from 'normalizr';
import { createPermissionsFromLinks } from '@caesar/common/utils/createPermissionsFromLinks';

const currentUserSchema = new schema.Entity(
  'user',
  {},
  {
    idAttribute: 'id',
    processStrategy: entity => ({
      ...entity,
      _permissions: entity?._links
        ? createPermissionsFromLinks(entity._links)
        : {},
    }),
  },
);

export default currentUserSchema;
