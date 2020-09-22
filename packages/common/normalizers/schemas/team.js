/* eslint-disable camelcase */
import { schema } from 'normalizr';
import { ENTITY_TYPE } from '@caesar/common/constants';

const teamSchema = new schema.Entity('byId', undefined, {
  processStrategy: entity => ({
    ...entity,
    __type: ENTITY_TYPE.TEAM,
    _permissions: entity._links
      ? Object.keys(entity._links).reduce(
          (accumulator, key) => ({
            ...accumulator,
            [key]: !!entity._links[key],
          }),
          {},
        )
      : {},
  }),
});

export default teamSchema;
