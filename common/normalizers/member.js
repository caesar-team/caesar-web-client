import { normalize, schema } from 'normalizr';

const member = new schema.Entity('byId');

export const normalizeMembers = members => {
  const normalized = normalize(members, [member]);

  return normalized.entities.byId || {};
};
