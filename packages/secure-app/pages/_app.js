import React from 'react';
// eslint-disable-next-line
import { default as NextApp } from 'next/app';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import globalStyles from '@caesar/assets/styles/globalStyles';
import theme from '@caesar/common/theme';
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga';
import { configureWebStore } from '@caesar/common/root/store';
import {
  NotificationProvider,
  OfflineDetectionProvider,
} from '@caesar/components';

const GlobalStyles = createGlobalStyle`${globalStyles}`;

class Application extends NextApp {
  static async getInitialProps({ Component, router: { route }, ctx }) {
    // entryResolver({ route, ctx });

    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};

    return { pageProps };
  }

  componentDidCatch(error, errorInfo) {
    super.componentDidCatch(error, errorInfo);
  }

  render() {
    const {
      Component,
      pageProps,
      router: { route },
    } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <OfflineDetectionProvider>
          <NotificationProvider>
            <GlobalStyles />
            <Component {...pageProps} />
          </NotificationProvider>
        </OfflineDetectionProvider>
      </ThemeProvider>
    );
  }
}

export default withRedux(configureWebStore)(withReduxSaga(Application));
