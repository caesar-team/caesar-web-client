import React from 'react';
// eslint-disable-next-line
import { default as NextApp, Container } from 'next/app';
import { entryResolver } from 'common/utils/entryResolver';
import { DEFAULT_IDLE_TIMEOUT } from 'common/constants';
import { getPasswordStatus } from 'common/api';
import { SessionChecker, Loader } from '../components';
import { MasterPassword } from '../containers';

export default class App extends NextApp {
  state = this.prepareInitialState();

  static async getInitialProps({ Component, router, ctx }) {
    entryResolver({ router, ctx });

    return Component.getInitialProps
      ? {
          pageProps: await Component.getInitialProps(ctx),
        }
      : {};
  }

  async componentDidMount() {
    if (this.props.router.route !== '/auth') {
      const {
        data: { created: isMasterPasswordCreated },
      } = await getPasswordStatus();

      const isSetPassword =
        sessionStorage.getItem('isSetPassword') &&
        sessionStorage.getItem('isSetPassword') === '1';

      this.setState({
        isFullWorkflow: !isMasterPasswordCreated,
        shouldShowLoader: false,
        shouldShowMasterPassword: !isSetPassword,
      });
    }
  }

  handleSetMasterPassword = () => {
    this.setState(
      {
        shouldShowMasterPassword: false,
        isFullWorkflow: false,
      },
      () => {
        sessionStorage.setItem('isSetPassword', '1');
      },
    );
  };

  handleInactiveTimeout = () => {
    this.setState(
      {
        shouldShowMasterPassword: true,
      },
      () => sessionStorage.setItem('isSetPassword', '0'),
    );
  };

  prepareInitialState() {
    const { router } = this.props;

    return {
      isFullWorkflow: true,
      shouldShowLoader: router.route !== '/auth',
      shouldShowMasterPassword: false,
    };
  }

  render() {
    const {
      isFullWorkflow,
      shouldShowMasterPassword,
      shouldShowLoader,
    } = this.state;
    const { Component, pageProps, router } = this.props;

    if (shouldShowLoader) {
      return <Loader />;
    }

    const shouldShowMasterPasswordWorkflow =
      router.route !== '/auth' && shouldShowMasterPassword;

    if (shouldShowMasterPasswordWorkflow) {
      return (
        <Container>
          <MasterPassword
            isFullWorkflow={isFullWorkflow}
            onSetMasterPassword={this.handleSetMasterPassword}
          />
        </Container>
      );
    }

    return (
      <Container>
        <SessionChecker
          timeout={DEFAULT_IDLE_TIMEOUT}
          onFinishTimeout={this.handleInactiveTimeout}
        >
          <Component {...pageProps} />
        </SessionChecker>
      </Container>
    );
  }
}
