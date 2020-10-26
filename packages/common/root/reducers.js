import { combineReducers } from 'redux';
import {
  memberReducer,
  currentUserReducer,
  workflowReducer,
  listReducer,
  itemReducer,
  teamReducer,
  applicationReducer,
  keystoreReducer,
  systemReducer,
} from '../reducers';

const entitiesReducer = combineReducers({
  member: memberReducer,
  list: listReducer,
  item: itemReducer,
  team: teamReducer,
  system: systemReducer,
});

export const rootReducer = combineReducers({
  application: applicationReducer,
  currentUser: currentUserReducer,
  entities: entitiesReducer,
  workflow: workflowReducer,
  keystore: keystoreReducer,
});
