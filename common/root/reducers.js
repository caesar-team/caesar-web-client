import { combineReducers } from 'redux';
import {
  memberReducer,
  userReducer,
  workflowReducer,
  listReducer,
  itemReducer,
  childItemReducer,
} from '../reducers';

const entitiesReducer = combineReducers({
  member: memberReducer,
  list: listReducer,
  item: itemReducer,
  childItem: childItemReducer,
});

export const rootReducer = combineReducers({
  entities: entitiesReducer,
  user: userReducer,
  workflow: workflowReducer,
});
