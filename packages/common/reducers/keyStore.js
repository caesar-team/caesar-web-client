import { createReducer } from '@caesar/common/utils/reducer';
import { extractKeysFromSystemItem } from '@caesar/common/utils/item';
import { KEY_TYPE } from '@caesar/common/constants';
import {
  ADD_PERSONAL_KEY_PAIR,
  ADD_TEAM_KEY_PAIR,
  ADD_ANONYMOUS_KEY_PAIR,
  REMOVE_PERSONAL_KEY_PAIR,
  REMOVE_TEAM_KEY_PAIR,
  REMOVE_ANONYMOUS_KEY_PAIR,
} from '@caesar/common/actions/keyStore';

const initialState = {
  data: {
    [KEY_TYPE.PERSONAL]: {},
    [KEY_TYPE.TEAM]: {},
    [KEY_TYPE.ANONYMOUS]: [],
  },
};

export default createReducer(initialState, {
  [ADD_PERSONAL_KEY_PAIR](state, { payload }) {console.log(payload);
    return {
      ...state,
      data: {
        ...state.data,
        [KEY_TYPE.PERSONAL]: payload.data,
      },
    };
  },
  [ADD_TEAM_KEY_PAIR](state, { payload }) {
    const { id, data } = payload.data;
    const {
      publicKey,
      privateKey,
    } = extractKeysFromSystemItem(data);

    return {
      ...state,
      data: {
        ...state.data,
        [KEY_TYPE.TEAM]: {
          ...state.data[KEY_TYPE.TEAM],
          [id]: {
            id,
            name: data.name,
            publicKey,
            privateKey,
            raw: payload.data,
          },
        },
      },
    };
  },
  [ADD_ANONYMOUS_KEY_PAIR](state, { payload }) {
    return {
      ...state,
      data: {
        ...state.data,
        [KEY_TYPE.ANONYMOUS]: [
          ...state.data[KEY_TYPE.ANONYMOUS],
          payload.data,
        ],
      },
    };
  },
  [REMOVE_PERSONAL_KEY_PAIR](state) {
    return {
      ...state,
      data: {
        ...state.data,
        [KEY_TYPE.PERSONAL]: {},
      },
    };
  },
  [REMOVE_TEAM_KEY_PAIR](state) {
    return {
      ...state,
      data: {
        ...state.data,
        [KEY_TYPE.PERSONAL]: {},
      },
    };
  },
  [REMOVE_ANONYMOUS_KEY_PAIR](state) {
    return {
      ...state,
      data: {
        ...state.data,
        [KEY_TYPE.PERSONAL]: {},
      },
    };
  },
});
