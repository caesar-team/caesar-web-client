import { createReducer } from '@caesar/common/utils/reducer';
import { KEY_TYPE } from '@caesar/common/constants';
import {
  ADD_PERSONAL_KEY_PAIR,
  ADD_TEAM_KEY_PAIR,
  ADD_SHARE_KEY_PAIR,
  ADD_ANONYMOUS_KEY_PAIR,
  REMOVE_PERSONAL_KEY_PAIR,
  REMOVE_TEAM_KEY_PAIR,
  REMOVE_SHARE_KEY_PAIR,
  REMOVE_ANONYMOUS_KEY_PAIR,
} from '@caesar/common/actions/keyStore';

const initialState = {
  [KEY_TYPE.PERSONAL]: {},
  [KEY_TYPE.TEAMS]: {},
  [KEY_TYPE.SHARES]: {},
  [KEY_TYPE.ANONYMOUS]: [],
};

export default createReducer(initialState, {
  [ADD_PERSONAL_KEY_PAIR](state, { payload }) {
    return {
      ...state,
      [KEY_TYPE.PERSONAL]: payload.data,
    };
  },
  [ADD_TEAM_KEY_PAIR](state, { payload }) {
    const {
      id,
      data: { name, pass, raws = {} },
    } = payload.data;
    const { publicKey, privateKey } = raws || {};
    // TODO: Get teamId and make it as a key

    return {
      ...state,
      [KEY_TYPE.TEAMS]: {
        ...state[KEY_TYPE.TEAMS],
        [id]: {
          id,
          name,
          pass,
          publicKey,
          privateKey,
        },
      },
    };
  },
  [ADD_SHARE_KEY_PAIR](state, { payload }) {
    const {
      id,
      data: { name, pass, raws = {} } = { raws: {} },
      relatedItem,
    } = payload.data;
    const itemId = relatedItem?.id || null;
    if (!itemId) return state;

    const { publicKey, privateKey } = raws || {};

    return {
      ...state,
      [KEY_TYPE.SHARES]: {
        ...state[KEY_TYPE.SHARES],
        [itemId]: {
          id,
          name,
          pass,
          publicKey,
          privateKey,
        },
      },
    };
  },
  [ADD_ANONYMOUS_KEY_PAIR](state, { payload }) {
    return {
      ...state,
      [KEY_TYPE.ANONYMOUS]: [...state[KEY_TYPE.ANONYMOUS], payload.data],
    };
  },
  [REMOVE_PERSONAL_KEY_PAIR](state) {
    return {
      ...state,
      [KEY_TYPE.PERSONAL]: {},
    };
  },
  [REMOVE_TEAM_KEY_PAIR](state, { payload }) {
    return {
      ...state,
      [KEY_TYPE.TEAMS]: {
        ...state[KEY_TYPE.TEAMS],
        [payload.teamId]: undefined,
      },
    };
  },
  [REMOVE_SHARE_KEY_PAIR](state, { payload }) {
    return {
      ...state,
      [KEY_TYPE.SHARES]: {
        ...state[KEY_TYPE.SHARES],
        [payload.itemId]: undefined,
      },
    };
  },
  [REMOVE_ANONYMOUS_KEY_PAIR](state) {
    return {
      ...state,
      [KEY_TYPE.ANONYMOUS]: [],
    };
  },
});
