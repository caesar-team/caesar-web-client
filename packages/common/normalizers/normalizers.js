import { normalize } from 'normalizr';
import { LIST_TYPE } from '@caesar/common/constants';
import { listSchema, memberSchema, teamSchema } from './schemas';

export const extractRelatedItems = lists =>
  lists.map(({ children, type, ...rest }) => {
    if (type !== LIST_TYPE.INBOX) {
      return {
        ...rest,
        type,
        children,
      };
    }

    const relatedItems = children.map(item => item.relatedItem || null);
    return {
      ...rest,
      type,
      children: [
        ...children,
        ...relatedItems,
      ],
    };
  });

export const convertNodesToEntities = nodes => {
  const normalized = normalize(nodes, [listSchema]);

  return {
    listsById: normalized.entities.listsById || {},
    itemsById: normalized.entities.itemsById || {},
    childItemsById: normalized.entities.childItemsById || {},
  };
};

export const convertMembersToEntity = members => {
  const normalized = normalize(members, [memberSchema]);

  return normalized.entities.byId || {};
};

export const convertTeamsToEntity = teams => {
  const normalized = normalize(teams, [teamSchema]);

  return normalized.entities.byId || {};
};
