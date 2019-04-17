import React from 'react';
// eslint-disable-next-line
import { default as NextApp, Container } from 'next/app';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import globalStyles from 'common/styles/globalStyles';
import { entryResolver } from 'common/utils/entryResolver';
import theme from 'common/theme';
import { NotificationProvider } from '../components';
import { Bootstrap } from '../containers';

const GlobalStyles = createGlobalStyle`${globalStyles}`;

export default class App extends NextApp {
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
              <Component {...pageProps} />
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
            <Bootstrap {...pageProps} component={Component} />
          </Container>
        </NotificationProvider>
      </ThemeProvider>
    );
  }
}
