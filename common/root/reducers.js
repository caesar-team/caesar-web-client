import { combineReducers } from 'redux';
import {
  memberReducer,
  userReducer,
  workflowReducer,
  listReducer,
  itemReducer,
  childItemReducer,
  teamReducer,
} from '../reducers';

const entitiesReducer = combineReducers({
  member: memberReducer,
  list: listReducer,
  item: itemReducer,
  childItem: childItemReducer,
  team: teamReducer,
});

export const rootReducer = combineReducers({
  entities: entitiesReducer,
  user: userReducer,
  workflow: workflowReducer,
});
