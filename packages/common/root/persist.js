import { createTransform } from 'redux-persist';
import localForage from 'localforage';
import { IS_PROD } from '../constants';

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
    const { masterPassword, keyPair, ...cleanUser } = inboundState;
    const { ...user } = inboundState;

    return IS_PROD ? cleanUser : user;
  },
  outboundState => outboundState,
  { whitelist: [] },
);

export const persistOptions = {
  key: 'root',
  localForage,
  blacklist: ['application', 'workflow', 'user'],
  transforms: [itemTransform, userTransform],
};
