import React from 'react';
// eslint-disable-next-line
import { default as NextApp } from 'next/app';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import globalStyles from 'common/styles/globalStyles';
import { entryResolver } from 'common/utils/entryResolver';
import theme from 'common/theme';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga';
import { configureWebStore } from 'common/root/store';
import { UNLOCKED_ROUTES, SHARED_ROUTES } from 'common/constants';
import { Bootstrap } from 'containers';
import {
  NotificationProvider,
  OfflineDetectionProvider,
  OfflineNotification,
  AbilityProvider,
} from 'components';

const GlobalStyles = createGlobalStyle`${globalStyles}`;

class Application extends NextApp {
  static async getInitialProps({ Component, router: { route }, ctx }) {
    entryResolver({ route, ctx });

    const pageProps =
      Component.getInitialProps && UNLOCKED_ROUTES.includes(route)
        ? await Component.getInitialProps(ctx)
        : {};

    return { pageProps };
  }

  render() {
    const {
      Component,
      pageProps,
      router: { route },
      store,
    } = this.props;

    if (SHARED_ROUTES.includes(route)) {
      return (
        <ThemeProvider theme={theme}>
          <NotificationProvider>
            <GlobalStyles />
            <Provider store={store}>
              <Component {...pageProps} />
              <OfflineNotification />
            </Provider>
          </NotificationProvider>
        </ThemeProvider>
      );
    }

    if (UNLOCKED_ROUTES.includes(route)) {
      return (
        <ThemeProvider theme={theme}>
          <NotificationProvider>
            <GlobalStyles />
            <Component {...pageProps} />
          </NotificationProvider>
        </ThemeProvider>
      );
    }

    return (
      <ThemeProvider theme={theme}>
        <NotificationProvider>
          <OfflineDetectionProvider>
            <GlobalStyles />
            <Provider store={store}>
              <AbilityProvider>
                <Bootstrap {...pageProps} component={Component} />
                <OfflineNotification />
              </AbilityProvider>
            </Provider>
          </OfflineDetectionProvider>
        </NotificationProvider>
      </ThemeProvider>
    );
  }
}

export default withRedux(configureWebStore)(withReduxSaga(Application));
