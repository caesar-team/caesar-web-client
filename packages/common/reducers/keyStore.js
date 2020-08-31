import { createReducer } from '@caesar/common/utils/reducer';
import { KEY_TYPE } from '@caesar/common/constants';
import {
  ADD_PERSONAL_KEY_PAIR,
  ADD_ENTITY_KEY_PAIR,
  ADD_ANONYMOUS_KEY_PAIR,
  REMOVE_PERSONAL_KEY_PAIR,
  REMOVE_ENTITY_KEY_PAIR,
  REMOVE_ANONYMOUS_KEY_PAIR,
} from '@caesar/common/actions/keyStore';

const initialState = {
  [KEY_TYPE.PERSONAL]: {},
  [KEY_TYPE.ENTITY]: {},
  [KEY_TYPE.ANONYMOUS]: [],
};

export default createReducer(initialState, {
  [ADD_PERSONAL_KEY_PAIR](state, { payload }) {
    return {
      ...state,
      [KEY_TYPE.PERSONAL]: payload.data,
    };
  },
  [ADD_ENTITY_KEY_PAIR](state, { payload }) {
    const { id, data: { name, pass, raws = {} } } = payload.data;
    const { publicKey, privateKey } = raws || {};

    return {
      ...state,
      [KEY_TYPE.ENTITY]: {
        ...state[KEY_TYPE.ENTITY],
        [id]: {
          id,
          name,
          pass,
          publicKey,
          privateKey,
          raw: payload.data,
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
  [REMOVE_ENTITY_KEY_PAIR](state, { payload }) {
    return {
      ...state,
      [KEY_TYPE.ENTITY]: {
        ...state[KEY_TYPE.ENTITY],
        [payload.entityId]: undefined,
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
