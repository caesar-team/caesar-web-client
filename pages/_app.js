import React from 'react';
// eslint-disable-next-line
import { default as NextApp, Container } from 'next/app';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import globalStyles from 'common/styles/globalStyles';
import { entryResolver } from 'common/utils/entryResolver';
import theme from 'common/theme';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga';
import { configureStore } from 'common/root/store';
import { Bootstrap } from '../containers';
import { NotificationProvider } from '../components';

const GlobalStyles = createGlobalStyle`${globalStyles}`;

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

    if (route === '/signin' || route === '/signup' || route === '/resetting') {
      return (
        <ThemeProvider theme={theme}>
          <Container>
            <GlobalStyles />
            <Component {...pageProps} />
          </Container>
        </ThemeProvider>
      );
    }

    if (route === '/share' || route === '/invite') {
      return (
        <ThemeProvider theme={theme}>
          <NotificationProvider>
            <Container>
              <GlobalStyles />
              <Provider store={store}>
                <Component {...pageProps} />
              </Provider>
            </Container>
          </NotificationProvider>
        </ThemeProvider>
      );
    }

    return (
      <ThemeProvider theme={theme}>
        <NotificationProvider>
          <Container>
            <GlobalStyles />
            <Provider store={store}>
              <Bootstrap {...pageProps} component={Component} />
            </Provider>
          </Container>
        </NotificationProvider>
      </ThemeProvider>
    );
  }
}

export default withRedux(configureStore)(withReduxSaga(Application));
