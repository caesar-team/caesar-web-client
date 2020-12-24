import { createReducer } from '@caesar/common/utils/reducer';
import { KEY_TYPE, TEAM_TYPE } from '@caesar/common/constants';
import {
  ADD_PERSONAL_KEY_PAIR,
  ADD_TEAM_KEY_PAIR,
  ADD_SHARE_KEY_PAIR,
  ADD_ANONYMOUS_KEY_PAIR,
  REMOVE_TEAM_KEY_PAIR,
  REMOVE_SHARE_KEY_PAIR,
  REMOVE_ANONYMOUS_KEY_PAIR,
  ADD_TEAM_KEY_PAIR_BATCH,
  ADD_SHARE_KEY_PAIR_BATCH,
  REMOVE_KEY_PAIR_BATCH_BY_TEAM_IDS,
  UPDATE_SHARE_KEY_PAIR,
  RESET_KEYSTORE_STATE,
} from '@caesar/common/actions/keystore';

import { arrayToObject } from '../utils/utils';

const initialState = {
  [KEY_TYPE.TEAMS]: {},
  [KEY_TYPE.SHARES]: {},
  [KEY_TYPE.ANONYMOUS]: {},
  isLoading: false,
  isError: false,
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
        ...state[KEY_TYPE.TEAMS],
        ...{
          [TEAM_TYPE.PERSONAL]: { privateKey, publicKey, password },
        },
      },
    };
  },

  [ADD_TEAM_KEY_PAIR_BATCH](
    state,
    {
      payload: { data },
    },
  ) {
    let pairsById = data;
    if (Array.isArray(data)) pairsById = arrayToObject(data);
    if (!pairsById) return state;

    if (Object.values(pairsById)?.length <= 0) return state;

    return {
      ...state,
      [KEY_TYPE.TEAMS]: {
        ...state[KEY_TYPE.TEAMS],
        ...pairsById,
      },
    };
  },
  [ADD_SHARE_KEY_PAIR_BATCH](
    state,
    {
      payload: { data },
    },
  ) {
    let pairsById = data;
    if (Array.isArray(data)) pairsById = arrayToObject(data);
    if (!pairsById) return state;

    if (Object.values(pairsById)?.length <= 0) return state;

    return {
      ...state,
      [KEY_TYPE.SHARES]: {
        ...state[KEY_TYPE.SHARES],
        ...pairsById,
      },
    };
  },
  [ADD_TEAM_KEY_PAIR](state, { payload }) {
    const {
      id,
      data: { name, password, raws = {} },
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
          password,
          publicKey,
          privateKey,
        },
      },
    };
  },
  [ADD_SHARE_KEY_PAIR](state, { payload }) {
    const {
      id,
      data: { name, password, raws = {} } = { raws: {} },
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
          password,
          publicKey,
          privateKey,
        },
      },
    };
  },
  [ADD_ANONYMOUS_KEY_PAIR](state, { payload }) {
    const {
      id,
      data: { name, password, raws = {} } = { raws: {} },
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
          password,
          publicKey,
          privateKey,
        },
      },
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
  [REMOVE_KEY_PAIR_BATCH_BY_TEAM_IDS](state, { payload }) {
    return {
      ...state,
      [KEY_TYPE.TEAMS]: Object.keys(state[KEY_TYPE.TEAMS]).reduce(
        (accumulator, itemId) =>
          payload.teamIds.includes(state[KEY_TYPE.TEAMS][itemId].teamId)
            ? accumulator
            : { ...accumulator, [itemId]: state[KEY_TYPE.TEAMS][itemId] },
        {},
      ),
      [KEY_TYPE.SHARES]: Object.keys(state[KEY_TYPE.SHARES]).reduce(
        (accumulator, itemId) =>
          payload.teamIds.includes(state[KEY_TYPE.SHARES][itemId].teamId)
            ? accumulator
            : { ...accumulator, [itemId]: state[KEY_TYPE.SHARES][itemId] },
        {},
      ),
    };
  },
  [UPDATE_SHARE_KEY_PAIR](state, { payload }) {
    return {
      ...state,
      [KEY_TYPE.SHARES]: {
        ...state[KEY_TYPE.SHARES],
        [payload.relatedItemId]: {
          ...state[KEY_TYPE.SHARES][payload.relatedItemId],
          teamId: payload.teamId,
        },
      },
    };
  },
  [RESET_KEYSTORE_STATE]() {
    return initialState;
  },
});
