import { createReducer } from '@caesar/common/utils/reducer';
import {
  KEY_TYPE,
  REGEXP_EXCTRACTOR,
  TEAM_TYPE,
} from '@caesar/common/constants';
import {
  ADD_PERSONAL_KEY_PAIR,
  ADD_TEAM_KEY_PAIR,
  ADD_SHARE_KEY_PAIR,
  ADD_ANONYMOUS_KEY_PAIR,
  REMOVE_PERSONAL_KEY_PAIR,
  REMOVE_TEAM_KEY_PAIR,
  REMOVE_SHARE_KEY_PAIR,
  REMOVE_ANONYMOUS_KEY_PAIR,
  ADD_TEAM_KEY_PAIR_BATCH,
  ADD_SHARE_KEY_PAIR_BATCH,
} from '@caesar/common/actions/keystore';

import { convertSystemItemToKeyPair } from '@caesar/common/utils/item';

const initialState = {
  [KEY_TYPE.PERSONAL]: {},
  [KEY_TYPE.TEAMS]: {},
  [KEY_TYPE.SHARES]: {},
  [KEY_TYPE.ANONYMOUS]: {},
};

export default createReducer(initialState, {
  [ADD_PERSONAL_KEY_PAIR](
    state,
    {
      payload: {
        data: { privateKey, publicKey, password },
      },
    },
  ) {
    return {
      ...state,
      [KEY_TYPE.TEAMS]: {
        [TEAM_TYPE.PERSONAL]: { privateKey, publicKey, password },
      },
    };
  },
  [ADD_TEAM_KEY_PAIR_BATCH](state, { payload }) {
    if (!payload.data || payload.data?.length <= 0) return state;
    // TODO: Use the normalizr library
    const keyPairs = {};
    payload.data.forEach(systemItem => {
      const {
        data: { name } = {
          name: null,
        },
      } = systemItem;
      keyPairs[
        REGEXP_EXCTRACTOR.ID(name) || systemItem.id
      ] = convertSystemItemToKeyPair(systemItem);
    });

    return {
      ...state,
      [KEY_TYPE.TEAMS]: {
        ...state[KEY_TYPE.TEAMS],
        ...keyPairs,
      },
    };
  },
  [ADD_SHARE_KEY_PAIR_BATCH](state, { payload }) {
    if (!payload.data || payload.data?.length <= 0) return state;

    // TODO: Use the normalizr library
    const keyPairs = {};
    payload.data.forEach(systemItem => {
      keyPairs[
        systemItem?.relatedItemId || systemItem.id
      ] = convertSystemItemToKeyPair(systemItem);
    });

    return {
      ...state,
      [KEY_TYPE.SHARES]: keyPairs,
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
      relatedItemId,
    } = payload.data;
    const itemId = relatedItemId || null;
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
    const {
      id,
      data: { name, pass, raws = {} } = { raws: {} },
      relatedItemId,
    } = payload.data;
    const itemId = relatedItemId || null;
    if (!itemId) return state;

    const { publicKey, privateKey } = raws || {};

    return {
      ...state,
      [KEY_TYPE.ANONYMOUS]: {
        ...state[KEY_TYPE.ANONYMOUS],
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
  [REMOVE_PERSONAL_KEY_PAIR](state) {
    return {
      ...state,
      [KEY_TYPE.PERSONAL]: {},
    };
  },
  [REMOVE_TEAM_KEY_PAIR](state, { payload }) {
    const newState = state[KEY_TYPE.TEAMS];
    delete newState[payload.itemId];

    return {
      ...state,
      [KEY_TYPE.TEAMS]: newState,
    };
  },
  [REMOVE_SHARE_KEY_PAIR](state, { payload }) {
    const newState = state[KEY_TYPE.SHARES];
    delete newState[payload.itemId];

    return {
      ...state,
      [KEY_TYPE.SHARES]: newState,
    };
  },
  [REMOVE_ANONYMOUS_KEY_PAIR](state, { payload }) {
    const newState = state[KEY_TYPE.ANONYMOUS];
    delete newState[payload.itemId];

    return {
      ...state,
      [KEY_TYPE.ANONYMOUS]: newState,
    };
  },
});
