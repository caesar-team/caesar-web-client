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

const currentUserTransform = createTransform(
  inboundState => {
    const { masterPassword, keyPair, ...cleanUser } = inboundState;
    const { ...currentUser } = inboundState;

    return IS_PROD ? cleanUser : currentUser;
  },
  outboundState => outboundState,
  { whitelist: ['currentUser'] },
);

const workflowTransform = createTransform(
  inboundState => {
    const { isLoading, isError, isReady, ...workflow } = inboundState;

    return workflow;
  },
  outboundState => outboundState,
  { whitelist: ['workflow'] },
);

export const persistOptions = {
  key: 'root',
  localForage,
  blacklist: ['application'],
  transforms: [itemTransform, currentUserTransform, workflowTransform],
};
