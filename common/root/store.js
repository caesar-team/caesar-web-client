import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import { rootReducer } from './reducers';
import { rootSaga } from './sagas';

export function configureWebStore(preloadedState) {
  const composeEnhancers = composeWithDevTools({});
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(sagaMiddleware)),
  );

  let sagaTask = sagaMiddleware.run(rootSaga);

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers')),
    );

    module.hot.accept('./sagas', () => {
      const getNewSagas = require('./sagas');
      sagaTask.cancel();
      sagaTask.done.then(() => {
        sagaTask = sagaMiddleware.run(function* replacedSaga() {
          yield getNewSagas();
        });
      });
    });
  }

  return {
    ...store,
    sagaTask,
  };
}

export function configureExtensionStore(preloadedState) {
  const composeEnhancers = composeWithDevTools({});
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(sagaMiddleware)),
  );

  sagaMiddleware.run(rootSaga);

  return store;
}
