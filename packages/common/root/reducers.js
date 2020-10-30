import { combineReducers } from 'redux';
import {
  currentUserReducer,
  workflowReducer,
  userReducer,
  memberReducer,
  teamReducer,
  listReducer,
  itemReducer,
  applicationReducer,
  keystoreReducer,
  systemReducer,
} from '../reducers';

const entitiesReducer = combineReducers({
  user: userReducer,
  team: teamReducer,
  member: memberReducer,
  list: listReducer,
  item: itemReducer,
  system: systemReducer,
});

export const rootReducer = combineReducers({
  application: applicationReducer,
  workflow: workflowReducer,
  currentUser: currentUserReducer,
  entities: entitiesReducer,
  keystore: keystoreReducer,
});
