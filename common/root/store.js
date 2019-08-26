import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createOffline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import { rehydrateStore } from 'common/actions/workflow';
import { rootReducer } from './reducers';
import { rootSaga } from './sagas';
import { persistOptions } from './persist';

export function configureWebStore(preloadedState) {
  const composeEnhancers = composeWithDevTools({});
  const sagaMiddleware = createSagaMiddleware();
  const {
    middleware: offlineMiddleware,
    enhanceReducer: offlineEnhanceReducer,
    enhanceStore: offlineEnhanceStore,
  } = createOffline({
    ...offlineConfig,
    persistOptions,
    persistCallback: rehydrateStore,
  });

  const store = createStore(
    offlineEnhanceReducer(rootReducer),
    preloadedState,
    composeEnhancers(
      offlineEnhanceStore,
      applyMiddleware(sagaMiddleware, offlineMiddleware),
    ),
  );

  const sagaTask = sagaMiddleware.run(rootSaga);

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
