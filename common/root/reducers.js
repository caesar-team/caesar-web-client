import { combineReducers } from 'redux';
import { nodeReducer } from '../reducers';

export const rootReducer = combineReducers({
  entities: combineReducers({
    node: nodeReducer,
  }),
});
