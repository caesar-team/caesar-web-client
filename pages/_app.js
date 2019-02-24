import React from 'react';
// eslint-disable-next-line
import { default as NextApp, Container } from 'next/app';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import globalStyles from 'common/styles/globalStyles';
import { entryResolver } from 'common/utils/entryResolver';
import { getToken } from 'common/utils/token';
import { getUserBootstrap } from 'common/api';
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

    if (route === '/share' || route === '/auth') {
      return { pageProps };
    }

    const token =
      ctx.req && ctx.req.cookies ? ctx.req.cookies.token : getToken();
    const { data: bootstrap } = await getUserBootstrap(token);

    return { pageProps: { bootstrap, ...pageProps } };
  }

  render() {
    const {
      Component,
      pageProps: { bootstrap, ...props },
      router,
    } = this.props;

    if (router.route === '/auth' || router.route === '/share') {
      return (
        <ThemeProvider theme={theme}>
          <Container>
            <GlobalStyles />
            <Component {...props} />
          </Container>
        </ThemeProvider>
      );
    }

    return (
      <ThemeProvider theme={theme}>
        <NotificationProvider>
          <Container>
            <GlobalStyles />
            <Bootstrap {...props} bootstrap={bootstrap} component={Component} />
          </Container>
        </NotificationProvider>
      </ThemeProvider>
    );
  }
}
