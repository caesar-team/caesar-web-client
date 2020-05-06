import { createTransform } from 'redux-persist';
import * as localForage from 'localforage';

const itemTransform = createTransform(
  inboundState => ({
    ...inboundState,
    item: {
      ...inboundState.item,
      byId: Object.keys(inboundState.item.byId).reduce(
        (accumulator, itemId) => {
          const { data, ...item } = inboundState.item.byId[itemId];
          return { ...accumulator, [itemId]: item };
        },
        {},
      ),
    },
  }),
  outboundState => outboundState,
  { whitelist: ['entities'] },
);

const userTransform = createTransform(
  inboundState => {
    const { masterPassword, ...user } = inboundState;
    return user;
  },
  outboundState => outboundState,
  { whitelist: ['user'] },
);

export const persistOptions = {
  key: 'root',
  localForage,
  blacklist: ['application', 'workflow'],
  transforms: [itemTransform, userTransform],
};
