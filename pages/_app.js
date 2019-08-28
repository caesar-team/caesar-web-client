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
import { Bootstrap } from '../containers';
import {
  NotificationProvider,
  OfflineDetectionProvider,
  OfflineNotification,
} from '../components';

const GlobalStyles = createGlobalStyle`${globalStyles}`;

const isNotRequiredTokenRoutes = [
  '/signin',
  '/signup',
  '/resetting',
  '/message',
  '/secure',
];
const isSharedRoutes = ['/share', 'invite'];

class Application extends NextApp {
  static async getInitialProps({ Component, router: { route }, ctx }) {
    entryResolver({ route, ctx });

    const pageProps = Component.getInitialProps
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

    if (isNotRequiredTokenRoutes.includes(route)) {
      return (
        <ThemeProvider theme={theme}>
          <NotificationProvider>
            <GlobalStyles />
            <Component {...pageProps} />
          </NotificationProvider>
        </ThemeProvider>
      );
    }

    if (isSharedRoutes.includes(route)) {
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

    return (
      <ThemeProvider theme={theme}>
        <NotificationProvider>
          <OfflineDetectionProvider>
            <GlobalStyles />
            <Provider store={store}>
              <Bootstrap {...pageProps} component={Component} />
              <OfflineNotification />
            </Provider>
          </OfflineDetectionProvider>
        </NotificationProvider>
      </ThemeProvider>
    );
  }
}

export default withRedux(configureWebStore)(withReduxSaga(Application));
