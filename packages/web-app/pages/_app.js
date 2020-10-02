import React from 'react';
// eslint-disable-next-line import/no-named-default
import { default as NextApp } from 'next/app';
import Head from 'next/head';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import '@caesar/assets/styles/additionalStyles';
import globalStyles from '@caesar/assets/styles/globalStyles';
import theme from '@caesar/common/theme';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga';
import { configureWebStore } from '@caesar/common/root/store';
import {
  UNLOCKED_ROUTES,
  SHARED_ROUTES,
  TECH_ROUTES,
} from '@caesar/common/constants';
import { Bootstrap } from '@caesar/containers';
import {
  NotificationProvider,
  OfflineNotification,
  AbilityProvider,
} from '@caesar/components';

const GlobalStyles = createGlobalStyle`${globalStyles}`;

class Application extends NextApp {
  static async getInitialProps({ Component, router: { route }, ctx }) {
    // entryResolver({ route, ctx });

    const pageProps =
      Component.getInitialProps && UNLOCKED_ROUTES.includes(route)
        ? await Component.getInitialProps(ctx)
        : {};

    return { pageProps };
  }

  componentDidCatch(error, errorInfo) {
    super.componentDidCatch(error, errorInfo);
  }

  renderRouterLayout() {
    const {
      Component,
      pageProps,
      router: { route },
      store,
    } = this.props;

    switch (true) {
      case SHARED_ROUTES.includes(route):
        return (
          <ThemeProvider theme={theme}>
            <NotificationProvider>
              <GlobalStyles />
              <Provider store={store}>
                <AbilityProvider>
                  <Component {...pageProps} />
                  <OfflineNotification />
                </AbilityProvider>
              </Provider>
            </NotificationProvider>
          </ThemeProvider>
        );

      case UNLOCKED_ROUTES.includes(route):
        return (
          <ThemeProvider theme={theme}>
            <NotificationProvider>
              <GlobalStyles />
              <Component {...pageProps} />
              <OfflineNotification />
            </NotificationProvider>
          </ThemeProvider>
        );

      case TECH_ROUTES.includes(route):
        return (
          <Provider store={store}>
            <Component {...pageProps} />
          </Provider>
        );

      default:
        return (
          <ThemeProvider theme={theme}>
            <NotificationProvider>
              <GlobalStyles />
              <Provider store={store}>
                <AbilityProvider>
                  <Bootstrap {...pageProps} component={Component} />
                  <OfflineNotification />
                </AbilityProvider>
              </Provider>
            </NotificationProvider>
          </ThemeProvider>
        );
    }
  }

  render() {
    return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        {this.renderRouterLayout()}
      </>
    );
  }
}

export default withRedux(configureWebStore)(withReduxSaga(Application));
