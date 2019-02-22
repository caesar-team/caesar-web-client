import React from 'react';
// eslint-disable-next-line
import { default as NextApp, Container } from 'next/app';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import globalStyles from 'common/styles/globalStyles';
import { entryResolver } from 'common/utils/entryResolver';
import { getToken } from 'common/utils/token';
import { base64ToObject } from 'common/utils/cipherUtils';
import { getUserBootstrap } from 'common/api';
import theme from 'common/theme';
import { NotificationProvider } from '../components';
import { Bootstrap } from '../containers';

const GlobalStyles = createGlobalStyle`${globalStyles}`;

export default class App extends NextApp {
  state = {
    sharedData: {},
  };

  static async getInitialProps({ Component, router: { route }, ctx }) {
    entryResolver({ route, ctx });

    let bootstrap = {};

    const token = ctx.req.cookies ? ctx.req.cookies.token : getToken();

    if (route !== '/share' && route !== '/auth') {
      const { data } = await getUserBootstrap(token);

      console.log('bootstrap', data);

      bootstrap = data;
    }

    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};

    return { pageProps: { bootstrap, ...pageProps } };
  }

  async componentDidMount() {
    const {
      router: { route },
      pageProps,
    } = this.props;

    if (route === '/share' && pageProps.encryption) {
      this.setState({
        sharedData:
          (pageProps.encryption && base64ToObject(pageProps.encryption)) || {},
      });
    }
  }

  render() {
    const { sharedData } = this.state;

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
            <Bootstrap
              {...props}
              bootstrap={bootstrap}
              component={Component}
              sharedData={sharedData}
            />
          </Container>
        </NotificationProvider>
      </ThemeProvider>
    );
  }
}
