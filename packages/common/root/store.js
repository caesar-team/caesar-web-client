import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createOffline } from '@redux-offline/redux-offline';
import { rehydrateStore } from '@caesar/common/actions/application';
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

  let sagaTask = sagaMiddleware.run(rootSaga);

  if (process.env.NODE_ENV === 'development' && module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/index');
      store.replaceReducer(nextRootReducer);
    });
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
