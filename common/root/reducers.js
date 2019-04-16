import { combineReducers } from 'redux';
import { nodeReducer, memberReducer, userReducer } from '../reducers';

export const rootReducer = combineReducers({
  entities: combineReducers({
    node: nodeReducer,
    member: memberReducer,
  }),
  user: userReducer,
});
