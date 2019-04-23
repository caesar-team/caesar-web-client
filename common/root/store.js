import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import { rootReducer } from './reducers';
import { rootSaga } from './sagas';

export function configureStore(preloadedState) {
  const composeEnhancers = composeWithDevTools({});
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(sagaMiddleware)),
  );

  return {
    ...store,
    sagaTask: sagaMiddleware.run(rootSaga),
  };
}
