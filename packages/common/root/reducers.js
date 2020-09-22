import { combineReducers } from 'redux';
import {
  memberReducer,
  userReducer,
  workflowReducer,
  listReducer,
  itemReducer,
  childItemReducer,
  teamReducer,
  applicationReducer,
  keystoreReducer,
  systemReducer,
} from '../reducers';

const entitiesReducer = combineReducers({
  member: memberReducer,
  list: listReducer,
  item: itemReducer,
  childItem: childItemReducer,
  team: teamReducer,
  system: systemReducer,
});

export const rootReducer = combineReducers({
  application: applicationReducer,
  user: userReducer,
  entities: entitiesReducer,
  workflow: workflowReducer,
  keystore: keystoreReducer,
});
