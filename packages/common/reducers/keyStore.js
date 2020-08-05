import { createReducer } from '@caesar/common/utils/reducer';
import { extractKeysFromSystemItem } from '@caesar/common/utils/item';
import {
  ADD_TEAMS_KEY_PAIR,
  REMOVE_TEAM_KEY_PAIR,
} from '@caesar/common/actions/keyStore';

const initialState = {
  data: {},
};

export default createReducer(initialState, {
  [ADD_TEAMS_KEY_PAIR](state, { payload }) {
    return {
      ...state,
      data: {
        ...state.data,
        ...payload.data.reduce((acc, item) => {
          const {
            publicKey,
            privateKey,
          } = extractKeysFromSystemItem(item.data);

          return {
            ...acc,
            [item.id]: {
              id: item.id,
              name: item.data.name,
              publicKey,
              privateKey,
              raw: item,
            }
          };
        }, {}),
      },
    };
  },
  [REMOVE_TEAM_KEY_PAIR](state, { payload }) {
    return { ...state };
  },
});
